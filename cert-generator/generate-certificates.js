#!/usr/bin/env node
'use strict';

// Generates internship certificates (HTML + PDF) from an Excel sheet of
// candidates, and registers each new certificate in ../js/certificates.js
// so verify.html on the live site can look it up.
//
// Usage:
//   node generate-certificates.js path/to/candidates.xlsx
//
// Excel columns (header row, case-insensitive):
//   Name        (required)
//   Start Date  (required)
//   End Date    (required)
//   Role/Title  (optional — defaults to DEFAULT_PROGRAM below)

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const XLSX = require('xlsx');
const puppeteer = require('puppeteer');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const SIGNATURE_PATH = path.join(__dirname, 'assets', 'signature-kajol.png');
const CERTIFICATES_JS_PATH = path.join(ROOT, 'js', 'certificates.js');
const OUTPUT_DIR = path.join(__dirname, 'output');

const DEFAULT_PROGRAM = 'GenAI & Agentic Systems Intern';
const DEFAULT_PROGRAM_FULL = 'GenAI and Agentic Systems Internship';
const SITE_URL = 'https://anton-io.com';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Fetched once per cert at generation time and inlined as a data URI, so the
// certificate file has no runtime dependency on api.qrserver.com — it'll
// render correctly even when downloaded/printed offline.
async function fetchQrDataUri(certId) {
  const verifyUrl = `${SITE_URL}/verify.html?id=${encodeURIComponent(certId)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&ecc=H&margin=8&data=${encodeURIComponent(verifyUrl)}`;
  const res = await fetch(qrUrl);
  if (!res.ok) throw new Error(`QR fetch failed for ${certId}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return `data:image/png;base64,${buf.toString('base64')}`;
}

// SheetJS represents Excel date cells as UTC instants, and the serial-number
// round-trip can leave them a few ms off midnight — snap to the nearest UTC
// day first so the date doesn't shift by one depending on local timezone.
function normalizeDateOnly(d) {
  return new Date(Math.round(d.getTime() / 86400000) * 86400000);
}

function formatDate(d) {
  const n = normalizeDateOnly(d);
  return `${String(n.getUTCDate()).padStart(2, '0')} ${MONTH_NAMES[n.getUTCMonth()]} ${n.getUTCFullYear()}`;
}

function monthsBetween(start, end) {
  const s = normalizeDateOnly(start);
  const e = normalizeDateOnly(end);
  let months = (e.getUTCFullYear() - s.getUTCFullYear()) * 12 + (e.getUTCMonth() - s.getUTCMonth());
  if (e.getUTCDate() > s.getUTCDate()) months += 1; // round up if end overshoots start's day-of-month
  return Math.max(1, months);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function loadExistingCertificates() {
  const code = fs.readFileSync(CERTIFICATES_JS_PATH, 'utf8');
  const sandbox = {};
  vm.createContext(sandbox);
  // `const CERTIFICATES` doesn't attach to the sandbox's global object on its
  // own (only `var`/function declarations do) — re-assign it explicitly.
  vm.runInContext(code + '\nthis.CERTIFICATES = CERTIFICATES;', sandbox);
  return sandbox.CERTIFICATES || [];
}

function nextCertId(allKnown, year) {
  let max = 0;
  for (const c of allKnown) {
    const m = /^ANTN-\d{4}-(\d+)$/.exec(c.id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `ANTN-${year}-${String(max + 1).padStart(4, '0')}`;
}

function readCandidates(excelPath) {
  const wb = XLSX.readFile(excelPath, { cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  return rows.map((row, i) => {
    const rowNum = i + 2; // header is row 1
    const get = (...keys) => {
      for (const key of Object.keys(row)) {
        if (keys.includes(key.trim().toLowerCase())) return row[key];
      }
      return '';
    };

    const name = String(get('name', 'candidate', 'candidate name')).trim();
    const role = String(get('role', 'title', 'role/title', 'position')).trim() || DEFAULT_PROGRAM;
    const startRaw = get('start date', 'start', 'commencement');
    const endRaw = get('end date', 'end', 'completion');

    if (!name) throw new Error(`Row ${rowNum}: missing Name`);
    if (!startRaw || !endRaw) throw new Error(`Row ${rowNum} (${name}): missing Start Date or End Date`);

    const startDate = startRaw instanceof Date ? startRaw : new Date(startRaw);
    const endDate = endRaw instanceof Date ? endRaw : new Date(endRaw);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error(`Row ${rowNum} (${name}): could not parse Start Date / End Date`);
    }

    return { name, role, startDate, endDate };
  });
}

function writeCertificatesJs(records) {
  const body = `// ── ISSUED CERTIFICATES ──
// Add one entry here every time a new internship certificate is issued.
// The "id" must exactly match the "Certificate No." printed on the certificate
// (and encoded in its QR code) so verify.html can look it up.
//
// This file is regenerated by cert-generator/generate-certificates.js —
// run that script again rather than editing the array below by hand.
const CERTIFICATES = ${JSON.stringify(records, null, 2)};
`;
  fs.writeFileSync(CERTIFICATES_JS_PATH, body);
}

async function main() {
  const excelPath = process.argv[2];
  if (!excelPath) {
    console.error('Usage: node generate-certificates.js path/to/candidates.xlsx');
    process.exit(1);
  }
  if (!fs.existsSync(excelPath)) {
    console.error(`File not found: ${excelPath}`);
    process.exit(1);
  }

  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  const existing = loadExistingCertificates();
  const candidates = readCandidates(excelPath);

  if (!fs.existsSync(SIGNATURE_PATH)) {
    console.error(`Signature image not found: ${SIGNATURE_PATH}`);
    process.exit(1);
  }
  // Inlined as a data URI so each generated certificate is a single
  // self-contained file (no broken image link if emailed without the assets folder).
  const signatureDataUri = `data:image/png;base64,${fs.readFileSync(SIGNATURE_PATH).toString('base64')}`;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // HTML generation + certificates.js registration always happens, even if
  // PDF rendering below fails — a Puppeteer/Chromium problem shouldn't block
  // certificates from being issued.
  const newRecords = [];
  const htmlPaths = [];

  for (const candidate of candidates) {
    const year = normalizeDateOnly(candidate.startDate).getUTCFullYear();
    const certId = nextCertId([...existing, ...newRecords], year);
    const startDate = formatDate(candidate.startDate);
    const endDate = formatDate(candidate.endDate);
    const months = monthsBetween(candidate.startDate, candidate.endDate);
    const duration = `${months} Month${months > 1 ? 's' : ''}`;
    const qrDataUri = await fetchQrDataUri(certId);

    const html = template
      .replaceAll('{{CERT_ID}}', certId)
      .replaceAll('{{NAME}}', escapeHtml(candidate.name))
      .replaceAll('{{ROLE}}', escapeHtml(candidate.role))
      .replaceAll('{{PROGRAM_FULL}}', DEFAULT_PROGRAM_FULL)
      .replaceAll('{{START_DATE}}', startDate)
      .replaceAll('{{END_DATE}}', endDate)
      .replaceAll('{{SIGNATURE_DATA_URI}}', signatureDataUri)
      .replaceAll('{{QR_DATA_URI}}', qrDataUri);

    const htmlPath = path.join(OUTPUT_DIR, `${certId}.html`);
    fs.writeFileSync(htmlPath, html);
    htmlPaths.push(htmlPath);

    newRecords.push({
      id: certId,
      name: candidate.name,
      program: candidate.role,
      startDate,
      endDate,
      duration,
    });

    console.log(`Generated ${certId}.html — ${candidate.name}`);
  }

  writeCertificatesJs([...existing, ...newRecords]);
  console.log('js/certificates.js was updated — commit & deploy it so verify.html recognizes the new certificates.');

  let pdfsGenerated = 0;
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    for (let i = 0; i < htmlPaths.length; i++) {
      await page.goto('file://' + htmlPaths[i], { waitUntil: 'networkidle0' });
      await page.pdf({
        path: htmlPaths[i].replace(/\.html$/, '.pdf'),
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
      });
      pdfsGenerated++;
      console.log(`Rendered ${newRecords[i].id}.pdf`);
    }
    await browser.close();
  } catch (err) {
    console.warn(`\nPDF rendering failed (${err.message}).`);
    console.warn('HTML certificates and js/certificates.js were still generated successfully.');
    console.warn('Open each .html file in a browser and use its "Save as PDF" button instead,');
    console.warn('or fix the Puppeteer/Chromium launch issue and re-run to get PDFs directly (see README.md).');
  }

  console.log(`\nDone. ${newRecords.length} certificate(s) written to ${OUTPUT_DIR} (${pdfsGenerated} PDF(s)).`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});

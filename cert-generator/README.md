# Certificate generator

Generates internship certificates (HTML + PDF) for a batch of candidates from
an Excel sheet, and registers each new certificate in `../js/certificates.js`
so the live `verify.html` page on the site recognizes them.

## One-time setup

```
cd cert-generator
npm install
```

This also downloads Puppeteer's bundled Chromium (~300MB), used to render
each certificate to PDF.

## Excel format

First sheet, header row, any column order. Column names are matched
case-insensitively:

| Name (required) | Start Date (required) | End Date (required) | Role/Title (optional) |
|---|---|---|---|
| Asha Verma | 2026-04-01 | 2026-06-30 | GenAI Engineering Intern |
| Rohan Mehta | 2026-04-01 | 2026-07-31 | |

- "Start"/"Commencement" and "End"/"Completion" are also accepted as column names.
- If Role/Title is left blank, it defaults to "GenAI & Agentic Systems Intern".
- Duration shown on the certificate is computed automatically from the dates.

## Run

```
node generate-certificates.js path/to/candidates.xlsx
```

For each row this:
1. Assigns the next sequential certificate number (`ANTN-<year>-NNNN`,
   continuing from whatever's already in `js/certificates.js`).
2. Writes `output/<certId>.html` and `output/<certId>.pdf`.
3. Appends the candidate's record to `js/certificates.js`.

## After running

- Send each candidate their PDF from `cert-generator/output/`.
- Commit the updated `js/certificates.js` and deploy the site — without
  that, `verify.html` won't recognize the new certificate numbers or QR codes.
- `output/` is gitignored (it holds candidate PII) — don't commit it.

## If Puppeteer fails to launch Chrome (macOS)

Puppeteer's downloaded Chromium build is unsigned. If `node
generate-certificates.js ...` fails with a spawn/launch error, the most
common fixes are:

- Run the Chrome binary once directly so macOS Gatekeeper can prompt you to
  allow it: find it under `~/.cache/puppeteer/chrome/.../Google Chrome for
  Testing.app`, right-click → Open in Finder, then approve the Gatekeeper
  dialog.
- Or point Puppeteer at an already-installed, properly signed browser
  instead of its own bundled build, by setting an env var before running:
  `PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node generate-certificates.js ...`

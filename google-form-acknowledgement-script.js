// SETUP (no need to find any "Script editor" menu inside Google Forms):
//
// 1. Open your Google Form for editing. Look at the URL — it looks like:
//      https://docs.google.com/forms/d/1AbCxyz.../edit
//    Copy the long ID between "/d/" and "/edit". That's your FORM_ID below.
//
// 2. Go to https://script.google.com → click "New project".
//
// 3. Delete the boilerplate code there and paste this whole file in.
//
// 4. Replace YOUR_FORM_ID_HERE below with the ID from step 1.
//
// 5. In the toolbar at the top, use the function dropdown (next to the Run/
//    Debug buttons) to select "installTrigger", then click Run (▶).
//    The first run will ask you to authorize — click "Advanced" → "Go to
//    [project name] (unsafe)" → Allow. This warning only appears because
//    it's your own private script, not a published public one.
//
// 6. Check the clock icon ("Triggers") in the left sidebar — you should see
//    a trigger for "sendAcknowledgement" on "Form submit". That confirms it
//    worked; you only need to run installTrigger once.
//
// 7. Submit a real test response on the form to confirm the email arrives.

var FORM_ID = 'YOUR_FORM_ID_HERE';

// Change this to your own address, then run "testSendEmail" from the
// function dropdown in the toolbar above (no form submission needed) to
// preview the email design in your own inbox before going live.
var TEST_EMAIL = 'your-email@example.com';

function testSendEmail() {
  sendAcknowledgementEmail(TEST_EMAIL);
}

function installTrigger() {
  var form = FormApp.openById(FORM_ID);
  ScriptApp.newTrigger('sendAcknowledgement')
    .forForm(form)
    .onFormSubmit()
    .create();
}

function sendAcknowledgement(e) {
  var itemResponses = e.response.getItemResponses();
  var email = null;

  for (var i = 0; i < itemResponses.length; i++) {
    var item = itemResponses[i];
    var title = item.getItem().getTitle().trim().toLowerCase();
    Logger.log('Question: "%s" -> Answer: "%s"', title, item.getResponse());
    if (title.indexOf('email') !== -1 && email === null) {
      email = item.getResponse();
    }
  }

  Logger.log('Resolved email address: %s', email);

  if (!email) {
    Logger.log('No email field matched — check the question titles logged above.');
    return;
  }

  sendAcknowledgementEmail(email);
}

// Public URL of the logo image used in the email header. Must be a live,
// publicly reachable https:// URL once the site is deployed — email clients
// fetch images remotely and cannot read local file paths.
var LOGO_URL = 'https://anton-io.com/images/logo-mark.png';

function sendAcknowledgementEmail(email) {
  var subject = 'Application Received — Anton IO Internship';

  var paragraphs = [
    'Dear Candidate,',
    'Thank you for submitting your application for the internship position at Anton IO. We have successfully received your details and appreciate your interest in joining our team.',
    "Our team is currently reviewing all applications manually to ensure each candidate's qualifications, skills, and experiences are carefully considered. We will be evaluating your profile against our current requirements and the specific needs of the internship role.",
    'Please note that this review process may take some time. We will reach out to you directly regarding the next steps if your background aligns with what we are looking for.',
    'Thank you again for your time and interest.'
  ];

  var plainBody = paragraphs.join('\n\n') + '\n\nSincerely,\nSupport Team\nAnton IO';

  var htmlParagraphs = paragraphs.map(function (p) {
    return '<p style="font-size:15px;line-height:1.7;color:#333333;margin:0 0 16px;">' + p + '</p>';
  }).join('');

  var htmlBody =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background-color:#ffffff;">' +
      '<div style="padding:28px 40px 24px;border-bottom:2px solid #111111;">' +
        '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>' +
          '<td style="padding-right:10px;"><img src="' + LOGO_URL + '" width="28" height="24" alt="" style="display:block;"></td>' +
          '<td style="font-size:20px;font-weight:700;letter-spacing:1px;color:#111111;">ANTON&nbsp;/O</td>' +
        '</tr></table>' +
      '</div>' +
      '<div style="padding:32px 40px;">' +
        htmlParagraphs +
        '<p style="font-size:15px;line-height:1.7;color:#333333;margin:32px 0 0;">Sincerely,<br><strong>Support Team</strong><br>Anton IO</p>' +
      '</div>' +
      '<div style="padding:20px 40px;background-color:#f7f7f7;border-top:1px solid #e0e0e0;">' +
        '<p style="font-size:12px;color:#888888;margin:0;">This is an automated message. If you have any questions, contact us at <a href="mailto:support.anton@anton-io.com" style="color:#111111;">support.anton@anton-io.com</a>.</p>' +
      '</div>' +
    '</div>';

  // Sends as kajol.ramchander@anton-io.com — requires that address to be
  // added and verified under Gmail → Settings → Accounts and Import → Send
  // mail as, using your Zoho Mail SMTP credentials. GmailApp (unlike
  // MailApp) can send from a verified alias instead of the account's own
  // address.
  GmailApp.sendEmail(email, subject, plainBody, {
    htmlBody: htmlBody,
    from: 'kajol.ramchander@anton-io.com',
    name: 'Anton IO Support Team'
  });
}

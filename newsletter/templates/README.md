# Brevo campaign templates (JA / EN)

Files: `update-ja.html`, `update-en.html`.

Use Brevo **Marketing → Templates → Email**, choose the HTML editor, and import/paste the corresponding HTML. Save each as a reusable template. Brevo's supported unsubscribe variable is **`{{ unsubscribe }}`** and must remain in the final HTML with a visible language-specific link.

**Do not send these drafts unchanged.** Replace:
- `[製品名]` / `[Product name]` and version.
- The three change bullets, and review the actual product release/download URL.
- The sender's **legally required name**, **public mailing address**, and a **working enquiry contact route**. Do not guess or accidentally expose a home address without approval.
- Ensure the email subject, sender email, confirmation message, and unsub link correspond to JA or EN subscribers.

Check the rendered test message on mobile and desktop. Verify actual list selection and unsubscribe suppression. Do not mistake Brevo's own account notification emails for the outgoing campaign footer.

References:
- https://help.brevo.com/hc/en-us/articles/209553645-Insert-a-custom-unsubscribe-link-in-your-emails
- https://help.brevo.com/hc/en-us/articles/4672127581074-Upload-an-HTML-file-to-design-your-emails-HTML-custom-code-editor
- https://www.dekyo.or.jp/soudan/contents/taisaku/1-2.html

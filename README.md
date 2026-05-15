# Al Malek QR Landing Page

This project powers the QR landing page at `join.almalekicecream.com`.

The site now supports a time-based prize entry flow without changing the QR URL. The homepage stays on the same URL, and a prize CTA appears only when the campaign is active in Google Sheets.

## What Changed

1. Homepage content is now fetched on the server for a faster first render and no client-side loading spinner.
2. The homepage can show a prize CTA when campaign settings are enabled and within the active time window.
3. A new page at `/prize-entry` shows the form.
4. A new API route at `/api/prize-entry` sends submitted entries to a second Google Apps Script endpoint.
5. Entries are kept in a separate Google document from the editable content labels.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in these values:

```env
CONTENT_URL=https://script.google.com/macros/s/YOUR_CONTENT_SCRIPT_ID/exec
ENTRY_SUBMIT_URL=https://script.google.com/macros/s/YOUR_ENTRY_SCRIPT_ID/exec
```

`CONTENT_URL` is the existing Apps Script endpoint that returns page labels.

`ENTRY_SUBMIT_URL` is a new Apps Script endpoint that accepts prize-entry form submissions.

## Existing Content Document

Keep the current labels document as the source of truth for homepage content and campaign control.

If your current sheet is a `key/value` sheet, add new rows with these keys.

If your current sheet is a header-based sheet, add new columns with these names.

The existing required content keys stay the same:

1. `tagline`
2. `tagline_note`
3. `promo_text`
4. `promo_note`
5. `whatsapp_label`
6. `whatsapp_sub`
7. `whatsapp_url`
8. `tiktok_label`
9. `tiktok_sub`
10. `tiktok_url`
11. `instagram_label`
12. `instagram_sub`
13. `instagram_url`

Add these new campaign keys to the same content output:

1. `campaign_id`
2. `campaign_enabled`
3. `campaign_button_label`
4. `campaign_form_title`
5. `campaign_form_description`
6. `campaign_success_message`

Optional scheduling keys if you ever want timed windows later:

1. `campaign_start_at`
2. `campaign_end_at`

Recommended values:

1. `campaign_id`: `summer-hour-1`
2. `campaign_enabled`: `TRUE` or `FALSE`
3. `campaign_button_label`: `ادخل معلوماتك للفوز`
4. `campaign_form_title`: `ادخل معلوماتك للفوز بجوائز قيمة`
5. `campaign_form_description`: `املأ النموذج التالي وسنتواصل معك عند السحب.`
6. `campaign_success_message`: `تم تسجيل معلوماتك بنجاح، بالتوفيق.`
7. `campaign_start_at`: optional, for example `2026-05-15T18:00:00+03:00`
8. `campaign_end_at`: optional, for example `2026-05-15T19:00:00+03:00`

The CTA only appears when all of these are true:

1. `campaign_enabled` is on
2. `campaign_button_label` is filled
3. `campaign_form_title` is filled
4. Current time is after `campaign_start_at` when a start time exists
5. Current time is before `campaign_end_at` when an end time exists

For the recommended manual workflow, leave `campaign_start_at` and `campaign_end_at` empty and control visibility only with `campaign_enabled`.

If the campaign fields are empty, the homepage behaves normally and no CTA is shown.

## New Entries Document

Create a new Google Sheet document only for form submissions.

Create one tab named `entries` with this header row:

1. `campaign_id`
2. `campaign_title`
3. `first_name`
4. `last_name`
5. `phone_number`
6. `submitted_at`
7. `source_path`
8. `referer`
9. `user_agent`

This keeps customer data separate from editable content labels.

## Apps Script For The New Entries Document

Open the new entries Google Sheet, then create an Apps Script project and deploy it as a web app.

Use this script as the starting point:

```javascript
const SHEET_NAME = 'entries';

function doPost(e) {
	try {
		const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

		if (!sheet) {
			return jsonResponse({ ok: false, error: 'Entries sheet not found' }, 500);
		}

		const payload = JSON.parse(e.postData.contents || '{}');

		sheet.appendRow([
			payload.campaign_id || '',
			payload.campaign_title || '',
			payload.first_name || '',
			payload.last_name || '',
			payload.phone_number || '',
			payload.submitted_at || new Date().toISOString(),
			payload.source_path || '',
			payload.referer || '',
			payload.user_agent || '',
		]);

		return jsonResponse({ ok: true });
	} catch (error) {
		return jsonResponse({ ok: false, error: String(error) }, 500);
	}
}

function jsonResponse(data, status) {
	const output = ContentService.createTextOutput(JSON.stringify(data));
	output.setMimeType(ContentService.MimeType.JSON);
	return output;
}
```

Deploy steps:

1. Click `Deploy`.
2. Choose `New deployment`.
3. Select `Web app`.
4. Set `Execute as` to `Me`.
5. Set access to `Anyone` or `Anyone with the link`.
6. Copy the web app URL.
7. Put that URL into `ENTRY_SUBMIT_URL`.

## Existing Content Script

Your current content Apps Script should keep returning the existing fields and now also return the new campaign fields.

The app expects a flat JSON object like this:

```json
{
	"tagline": "لم يحالفك الحظ اليوم...",
	"tagline_note": "القادم أجمل",
	"promo_text": "ابتسم... الدنيا ما بتقاوم اللي يضحك",
	"promo_note": "كن جزءاً من عائلتنا",
	"whatsapp_label": "قناة الواتساب",
	"whatsapp_sub": "لم ترغب بأن تكون جزءاً من التجربة...",
	"whatsapp_url": "https://...",
	"tiktok_label": "تيك توك",
	"tiktok_sub": "عائلة ايس كريم الملك تكبر فيك",
	"tiktok_url": "https://...",
	"instagram_label": "انستغرام",
	"instagram_sub": "ستوريك يسعدنا",
	"instagram_url": "https://...",
	"campaign_id": "summer-hour-1",
	"campaign_enabled": true,
	"campaign_start_at": "2026-05-15T18:00:00+03:00",
	"campaign_end_at": "2026-05-15T19:00:00+03:00",
	"campaign_button_label": "ادخل معلوماتك للفوز",
	"campaign_form_title": "ادخل معلوماتك للفوز بجوائز قيمة",
	"campaign_form_description": "املأ النموذج التالي وسنتواصل معك عند السحب.",
	"campaign_success_message": "تم تسجيل معلوماتك بنجاح، بالتوفيق."
}
```

## Submission Payload Sent By The Site

When the user submits the form, the site sends this JSON payload to `ENTRY_SUBMIT_URL`:

```json
{
	"campaign_id": "summer-hour-1",
	"campaign_title": "ادخل معلوماتك للفوز بجوائز قيمة",
	"first_name": "Ali",
	"last_name": "Hussein",
	"phone_number": "+966500000000",
	"submitted_at": "2026-05-15T15:03:22.311Z",
	"source_path": "/prize-entry",
	"referer": "https://join.almalekicecream.com/prize-entry",
	"user_agent": "Mozilla/5.0 ..."
}
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Performance Notes

The feature was added with minimal runtime cost:

1. Homepage content now loads on the server instead of waiting for a client fetch.
2. The prize form is only rendered when the campaign is active.
3. No polling, intervals, or heavy analytics logic were added.
4. The form page uses simple native inputs and one POST request on submit.

## Validation

Run:

```bash
npm run lint
```

# Arthentix Survey - Setup Guide
## How to Connect the Survey to Google Sheets for Response Collection

---

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Arthentix Artist Survey Responses"**
4. In Row 1, add these column headers:

```
A: timestamp
B: name
C: age
D: city
E: medium
F: experience
G: current_channels
H: income
I: frustration
J: commission_appeal
K: pay_499
L: paid_features
M: art_theft
N: pay_certificate
O: rental_interest
P: expected_rent
Q: india_focus
R: founding_artist
S: one_thing
T: phone
U: email
V: source
```

---

## Step 2: Create the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. Delete any existing code
3. Paste the following code:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    // Define column order (must match your sheet headers)
    var columns = [
      'timestamp', 'name', 'age', 'city', 'medium', 'experience',
      'current_channels', 'income', 'frustration', 'commission_appeal',
      'pay_499', 'paid_features', 'art_theft', 'pay_certificate',
      'rental_interest', 'expected_rent', 'india_focus', 'founding_artist',
      'one_thing', 'phone', 'email', 'source'
    ];

    // Build row array
    var row = columns.map(function(col) {
      return data[col] || '';
    });

    // Append to sheet
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Arthentix Survey API is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Click **Save** (Ctrl+S)
5. Name the project: "Arthentix Survey Backend"

---

## Step 3: Deploy as Web App

1. Click **Deploy → New Deployment**
2. Click the gear icon → Select **Web app**
3. Configure:
   - **Description:** "Arthentix Survey v1"
   - **Execute as:** "Me"
   - **Who has access:** "Anyone"
4. Click **Deploy**
5. **Authorize** when prompted (click through the "unsafe" warning - it's your own script)
6. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

---

## Step 4: Connect to Survey

1. Open `survey.html`
2. Find this line near the top of the `<script>` section:
   ```javascript
   const GOOGLE_SCRIPT_URL = '';
   ```
3. Paste your Web App URL between the quotes:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```
4. Save the file

---

## Step 5: Deploy the Survey

### Option A: GitHub Pages (Recommended)
1. Push `survey.html` to your GitHub repo
2. It will be available at: `https://yourusername.github.io/Arthentix/survey.html`

### Option B: Share directly
1. Host on any web server
2. Or use Vercel/Netlify for free hosting

---

## Step 6: Share in WhatsApp Groups

Copy this message and share:

```
🎨 Fellow artists! We're building an art platform specifically for Indian artists.

📋 Quick 3-min survey (anonymous): [YOUR SURVEY URL]

We want to understand:
✅ Your art selling experience
✅ What features matter to you
✅ Fair pricing for services

Your voice shapes this platform! Please share with artist friends 🙏
```

---

## Admin Features

### View Responses
- **Google Sheet:** Responses appear automatically in real-time
- **Local Backup:** Open browser console (F12) on the survey page and type:
  ```javascript
  viewResponses()    // See all local responses
  exportCSV()        // Download as CSV file
  ```

### Export Shortcut
- Press **Ctrl+Shift+A** on the survey page to instantly download CSV of local responses

---

## Survey Analytics Cheat Sheet

After collecting 50+ responses, analyze:

| Question | What It Tells You |
|----------|-------------------|
| `income` | Artist economic segments |
| `frustration` | Top problems to solve |
| `commission_appeal` | Price sensitivity on commissions |
| `pay_499` | Willingness to pay for subscription |
| `paid_features` | Which features to build first |
| `pay_certificate` | Authentication pricing validation |
| `rental_interest` | Art rental market demand |
| `founding_artist` | Early adopter pool size |
| `one_thing` | **Gold mine** - open-ended insights |

---

*Guide created: 23 February 2026*

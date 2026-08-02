# MetaSearch - Complete Chrome Extension with Backend
## Full working project, ready to deploy

---

# 🚀 INSTALLATION - COPY & PASTE THESE COMMANDS

## **STEP 1: Setup Vercel Backend (2 minutes)**

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login
```

Then open Vercel dashboard: https://vercel.com/dashboard

---

## **STEP 2: Deploy Backend**

```bash
# Copy the entire backend folder
# Go to the folder where you saved the project

cd MetaSearch-Complete

# Deploy to Vercel
vercel --prod
```

**After it deploys, you'll get a URL like:**
```
https://metasearch-api-xyz.vercel.app
```
**COPY THIS URL - you'll need it next**

---

## **STEP 3: Load Chrome Extension**

1. Open Chrome
2. Go to: `chrome://extensions/`
3. **Enable Developer Mode** (toggle top right)
4. Click **Load unpacked**
5. Select the **`extension/`** folder from this project
6. ✓ Done! Extension appears in toolbar

---

## **STEP 4: Configure Extension Settings**

1. Click extension icon in toolbar
2. Click **Settings**
3. Paste your Vercel URL in "Backend API URL"
   ```
   https://metasearch-api-xyz.vercel.app
   ```
4. Click **Save Settings**
5. ✓ Done!

---

## **STEP 5: Test It Works**

1. Click extension icon
2. Type a search query (e.g., "bitcoin")
3. Results appear below ✓

---

# 📁 PROJECT STRUCTURE

```
MetaSearch-Complete/
│
├── extension/                    ← Load this in Chrome
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── background.js
│   ├── options.html
│   └── options.js
│
├── backend/                      ← Deploy this to Vercel
│   ├── api/
│   │   └── search.js
│   ├── package.json
│   ├── vercel.json
│   └── .env.example
│
└── README.md                     ← This file
```

---

# 🔧 WHAT EACH PART DOES

### **Extension Folder** (`extension/`)
- Chrome popup UI (search box)
- Settings page
- Local data storage (cookies, cache, history)
- Communicates with backend API

### **Backend Folder** (`backend/`)
- Runs on Vercel (cloud servers)
- Receives search queries from extension
- Returns results
- Logs searches

---

# 💾 WHERE DATA IS STORED

| Data | Location | Expires |
|------|----------|---------|
| Search results cache | Chrome local storage | 1 hour |
| Search history | Chrome local storage | Never (until cleared) |
| Cookies (session) | Chrome cookies | 30 days |
| Settings | Chrome cloud storage | Never |

**Cookies used:**
- `last_search_query` - Stores your last search
- `user_session_id` - Stores your user ID for analytics

---

# 🌐 DOMAIN INFO

When deployed:
- **Frontend**: Chrome browser (local)
- **Backend**: `https://metasearch-api-xyz.vercel.app` (your Vercel domain)
- **Data storage**: Chrome's secure storage + cookies

---

# ⚡ QUICK TEST

After deployment, test the API:

```bash
# Replace YOUR-VERCEL-URL with your actual URL
curl https://YOUR-VERCEL-URL/api/health

# Should show: {"status":"ok",...}
```

---

# 🍪 COOKIE MANAGEMENT

### View Your Cookies
1. In Chrome, go to extension settings
2. Look at search history → shows stored cookies
3. Click "Clear" to delete all data

### Cookie Settings in Extension
- Settings → "Store search cookies" (enable/disable)
- Settings → "Keep search history" (enable/disable)

---

# 🔐 PRIVACY

- ✅ All searches cached locally first
- ✅ Backend doesn't store searches permanently
- ✅ Cookies cleared after 30 days
- ✅ Optional analytics (disabled by default)
- ✅ No 3rd party tracking

---

# 🆘 TROUBLESHOOTING

### Extension shows "Offline"
**Fix:** Settings → Update API URL to your Vercel URL → Save

### No search results
**Fix:** Check URL doesn't have `/api` at end. Should be just:
```
https://metasearch-api-xyz.vercel.app
```

### Can't deploy to Vercel
**Fix:** 
```bash
vercel logout
vercel login
vercel --prod
```

### Extension won't load in Chrome
**Fix:** 
1. Go to `chrome://extensions/`
2. Enable Developer Mode
3. Try "Load unpacked" again
4. Check manifest.json has no errors: https://jsonlint.com/

### Cookies not saving
**Fix:** Settings → Enable "Store search cookies" checkbox

---

# 📊 WHAT'S INCLUDED

✅ Full Chrome extension with UI  
✅ Serverless backend (ready for Vercel)  
✅ Cookie storage system  
✅ Search history  
✅ Settings panel  
✅ API health check  
✅ Result caching  
✅ Dark theme design  

---

# 🎯 NEXT STEPS

1. **Deploy backend** (Vercel)
2. **Load extension** (Chrome)
3. **Configure API URL** (Extension settings)
4. **Search!** 🔍

---

# 📞 SUPPORT

| Issue | Solution |
|-------|----------|
| Vercel deploy fails | Run `npm install -g vercel` first |
| Extension errors | Check Chrome console: right-click extension → Inspect popup |
| API errors | Test: `curl https://YOUR-URL/api/health` |
| Cookies not working | Settings → Enable cookie storage |

---

# 🚀 YOU'RE READY!

Follow the 5 steps at the top and you're done.

Questions? Check each file:
- `extension/popup.html` - UI layout
- `extension/popup.js` - Search logic
- `backend/api/search.js` - API endpoint
- `backend/vercel.json` - Deployment config

**Start now:** `npm install -g vercel` then `vercel login` 🎉

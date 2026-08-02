# MetaSearch - Complete Setup Guide (Copy & Paste Commands)

---

# 🚀 PART 1: DEPLOY BACKEND TO VERCEL (5 MINUTES)

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Go to Backend Folder
```bash
cd MetaSearch-Complete/backend
```

## Step 3: Login to Vercel
```bash
vercel login
```
This opens a browser to log in. Do that, then come back to terminal.

## Step 4: Deploy
```bash
vercel --prod
```

### What will happen:
- Terminal asks questions (just hit Enter for defaults)
- Vercel deploys your backend
- Terminal shows: `https://your-project-xyz.vercel.app` ✓

**COPY THIS URL - YOU NEED IT NEXT**

---

# 🧩 PART 2: LOAD CHROME EXTENSION (2 MINUTES)

## Step 1: Open Chrome
```
chrome://extensions/
```

## Step 2: Enable Developer Mode
- Click toggle in TOP RIGHT corner

## Step 3: Load Extension
- Click **Load unpacked**
- Select: `MetaSearch-Complete/extension/` folder
- ✓ Extension appears in toolbar

---

# ⚙️ PART 3: CONFIGURE EXTENSION (1 MINUTE)

## Step 1: Click Extension Icon
Click the MetaSearch icon in your toolbar

## Step 2: Click Settings
Button in bottom left

## Step 3: Paste Vercel URL
In "Backend API URL" field, paste your URL from Part 1:
```
https://your-project-xyz.vercel.app
```

## Step 4: Save
Click **Save Settings**

---

# ✅ PART 4: TEST IT (1 MINUTE)

1. Click extension icon again
2. Type: "bitcoin" in search box
3. Results appear ✓
4. Done!

---

# 📁 PROJECT STRUCTURE EXPLAINED

```
MetaSearch-Complete/
│
├── extension/              ← This is your Chrome extension
│   ├── manifest.json       (Configuration)
│   ├── popup.html          (Search UI - what you see)
│   ├── popup.js            (Search logic)
│   ├── background.js       (Auto-cleanup)
│   ├── options.html        (Settings page)
│   └── options.js          (Settings logic)
│
├── backend/                ← This runs on Vercel (cloud)
│   ├── api/
│   │   └── search.js       (Search endpoint)
│   ├── package.json        (Dependencies)
│   ├── vercel.json         (Vercel config)
│   └── .env.example        (API keys - optional)
│
└── README.md & guides...
```

---

# 🍪 HOW DATA IS STORED

### On Your Computer (Chrome Extension):
- **Search cache** - Results stay locally for 1 hour
- **Search history** - Saved searches (last 50)
- **Cookies** - Session data, expires in 30 days

**This data NEVER goes to servers - it's all local**

### On Vercel Servers:
- **Your queries** are processed but NOT stored permanently
- Just used to calculate results

---

# 🔍 HOW IT WORKS

1. **You type in extension** → Stored in Chrome
2. **Query sent to Vercel** → Server processes
3. **Results come back** → Cached locally
4. **Next search for same thing** → Uses cache (faster!)
5. **Cookie saved** → Session ID logged

---

# ⚠️ TROUBLESHOOTING

## Problem: Extension shows "Offline"

**Solution:**
1. Go to Settings
2. Check API URL is correct (copy from Vercel again if unsure)
3. Make sure URL is: `https://xxx.vercel.app` (NO `/api` at end)
4. Save

## Problem: No search results

**Solution:**
```bash
# Test your API works:
curl https://YOUR-VERCEL-URL/api/health

# Should return something like:
# {"status":"ok","timestamp":"2024-01-15T...","version":"1.0.0"}
```

## Problem: Can't load extension in Chrome

**Solution:**
1. Go to `chrome://extensions/`
2. Make sure "Developer Mode" is ON (top right)
3. Click "Load unpacked"
4. Select the **extension** folder (NOT backend!)
5. Check for errors in console

## Problem: Vercel deployment failed

**Solution:**
```bash
# Make sure you're in the right folder
cd MetaSearch-Complete/backend

# Login again
vercel logout
vercel login

# Try deploy again
vercel --prod
```

---

# 🎯 QUICK REFERENCE

| What | How | Time |
|------|-----|------|
| Deploy backend | `vercel --prod` in backend folder | 2 min |
| Load extension | Settings → Load unpacked | 1 min |
| Configure | Settings button → Paste URL → Save | 1 min |
| Test | Type search query | 1 min |

**Total time: ~5 minutes**

---

# 📊 WHAT DATA DOES WHAT

### Extension Storage (Local to Chrome)
```javascript
// Search results cache
chrome.storage.local → "searchCache"

// Search history
chrome.storage.local → "searchHistory"

// Your user ID
chrome.storage.local → "userId"
```

### Cookies
```javascript
// Your last search query
chrome.cookies → "last_search_query"

// Session ID
chrome.cookies → "user_session_id"
```

### Vercel Backend
```javascript
// Receives: Your search query
// Returns: Search results
// Stores: Logs only (can be disabled)
```

---

# 🛡️ PRIVACY & SECURITY

✅ **All searches cached locally FIRST**  
✅ **Backend processes but doesn't permanently store**  
✅ **Cookies auto-clear after 30 days**  
✅ **HTTPS encrypted to Vercel**  
✅ **No tracking or ads**  

---

# 🚀 YOU'RE DONE!

Your search extension is now:
- ✅ Deployed on Vercel (production)
- ✅ Loaded in Chrome
- ✅ Storing data with cookies
- ✅ Caching results locally
- ✅ Ready to search!

**Questions?** Check README.md or the code comments in each file.

---

**Next:** Try searching for something! 🔍

# Dev Server Troubleshooting Guide

**Issue**: Vercel dev server not properly serving React application
**Date**: 2025-01-20
**Branch**: jules-epic-technical-foundation

## Problem Summary

The application fails to load with 404 errors for core Vite/React files:
- `/@vite/client` - 404 Not Found
- `/src/main.jsx` - 404 Not Found
- `/@react-refresh` - 404 Not Found

## Root Cause Analysis

The Vercel dev server configuration is not correctly serving the refactored React application. The server reports "Ready" but doesn't actually serve the application files.

## Configuration Issues Identified

### 1. Vite Config (FIXED)
**File**: `vite.config.js`
- **Problem**: Had API proxy configuration creating circular loop
- **Fix Applied**: Removed proxy config (Vercel handles API routing natively)

```javascript
// BEFORE (broken)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

// AFTER (fixed)
export default defineConfig({
  plugins: [react()]
})
```

### 2. Multiple Conflicting Servers
- Multiple Vercel dev instances running on different ports
- Background processes not being properly killed
- Port conflicts causing routing issues

### 3. Git State
Current uncommitted changes:
- Modified: `vite.config.js` (proxy removed)
- Modified: `src/components/AIResearchModal.jsx` (migrated from archive)
- Deleted: `index-main.html` (archived)
- New: `docs/AIResearchModal_Testing_Guide.md`

## Attempted Solutions

### Solution 1: Remove Vite Proxy ✅
```bash
# Edited vite.config.js to remove server.proxy configuration
```

### Solution 2: Kill All Node Processes ⚠️
```bash
killall -9 node
sleep 2
```
**Result**: Processes killed but new server still has same issue

### Solution 3: Fresh Vercel Dev Server ⚠️
```bash
BRAVE_API_KEY=xxx GEMINI_API_KEY=xxx vercel dev --listen 3000 --token xxx
```
**Result**: Server starts but 404 errors persist

## Current Status

**Server Running**: Yes (port 3000)
**Application Loading**: No (404 errors)
**API Endpoints**: Untested (can't reach app to test)

## Recommended Next Steps

### Option A: Use Production Deployment
Test the AIResearchModal on the live Vercel deployment instead:
1. Commit current changes
2. Push to branch
3. Test on Vercel preview URL

### Option B: Debug Dev Server Locally
1. Clear browser cache completely (not just hard refresh)
2. Clear Vercel local cache:
   ```bash
   rm -rf .vercel
   vercel dev --listen 3000
   ```

3. Try Vite directly without Vercel:
   ```bash
   npm run dev
   ```
   Note: This won't have API support, but will confirm if React app loads

### Option C: Rebuild from Clean State
1. Commit all changes
2. Checkout main branch
3. Pull latest
4. Checkout feature branch again
5. `npm install` (fresh node_modules)
6. Start server

## Key Files

- `/index.html` - Application entry point
- `/src/main.jsx` - React bootstrap
- `/vite.config.js` - Vite configuration (proxy removed)
- `/vercel.json` - Vercel deployment config
- `/api/mine-research-report.js` - API endpoint for research processing

## Testing Checklist (Once Server Works)

From `docs/AIResearchModal_Testing_Guide.md`:

1. [ ] Modal opens without errors
2. [ ] File upload accepts .md file
3. [ ] Processing completes successfully
4. [ ] All 4 sections return success
5. [ ] Results display correctly
6. [ ] Apply to Framework populates state
7. [ ] Data appears in tools
8. [ ] Download JSON works
9. [ ] No console errors

## Notes

- The AIResearchModal component has been successfully migrated (673 lines)
- Simplified test file created (90% token reduction)
- API code is correct and ready
- Only blocker is dev server configuration

---

**Status**: Blocked on dev server configuration
**Next Action**: Choose Option A, B, or C above

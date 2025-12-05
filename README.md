# Crescender Complete Component Catalogue

**Universal UI component reference across all Crescender apps**

## Overview

This is a standalone Next.js application that automatically discovers and catalogues all React components across the entire Crescender ecosystem:

- **crescender-core** (Main app)
- **crescender-account** (Auth service)
- **geargrabber** (Receipt OCR app)
- **clavet** (Songwriting AI app)

The catalogue **does not host** the components - it dynamically discovers them from their source locations and provides a searchable, filterable reference.

---

## Features

✅ **Automatic Discovery** - Zero manual configuration, folder/file-based scanning  
✅ **Real-time Scanning** - Always reflects current state of all apps  
✅ **App Filtering** - Filter by core, account, geargrabber, or clavet  
✅ **Directory Filtering** - Browse by component directory  
✅ **Search** - Find components by name  
✅ **Props Detection** - Shows which components have props interfaces  
✅ **Code Snippets** - Copy file paths and import statements  
✅ **Props Inspection** - View prop interfaces inline  

---

## Getting Started

### Installation

```bash
cd /Users/linc/Dev-Work/Crescender/complete-catalogue
npm install
```

### Run Locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

---

## How It Works

### 1. Component Discovery

The scanner (`lib/component-scanner.ts`) recursively searches these directories:

```
/Users/linc/Dev-Work/Crescender/crescender-core/components
/Users/linc/Dev-Work/Crescender/crescender-core/tmp/crescender-account/components
/Users/linc/Dev-Work/Crescender/crescender-core/tmp/geargrabber/components
/Users/linc/Dev-Work/Crescender/clavet/components
```

### 2. Component Analysis

For each `.tsx` or `.jsx` file found, it extracts:
- Component name (from filename)
- Full file path
- Relative path within app
- Directory location
- Whether it has props (detects `interface XProps` or `type XProps`)
- Props interface definition (if exists)

### 3. API Endpoint

The `/api/components` endpoint runs the scanner and returns:
```json
{
  "success": true,
  "data": {
    "components": [...],
    "directories": [...],
    "counts": { "core": 450, "account": 25, ... },
    "total": 550
  }
}
```

### 4. UI

The main page (`app/page.tsx`) displays:
- **Stats cards** - Component count per app (clickable filters)
- **Filter controls** - Search, app selector, directory selector
- **Component cards** - Each component with metadata and actions
- **Actions** - Copy file path, copy import statement

---

## Component Card Features

Each component card shows:

```
┌─────────────────────────────────┐
│ ComponentName        [core][Props]│
│                                   │
│ Directory: /auth                  │
│ File: auth/signin-form.tsx        │
│                                   │
│ [Show Props Interface] ▼          │
│ interface SignInFormProps {       │
│   onSuccess: () => void;          │
│ }                                 │
│                                   │
│ [Copy Path] [Copy Import]         │
└─────────────────────────────────┘
```

---

## Usage Examples

### Finding a Component

1. **By Name:** Type "Button" in search
2. **By App:** Click "geargrabber" stat card or use app dropdown
3. **By Directory:** Select "/ui" from directory dropdown
4. **Combined:** Search "Button" + filter to "core" app + "/ui" directory

### Copying Import Statement

Click "Copy Import" button to get:
```typescript
import { Button } from '@/components/ui/button';
```

### Copying File Path

Click "Copy Path" to get full filesystem path:
```
/Users/linc/Dev-Work/Crescender/crescender-core/components/ui/button.tsx
```

---

## Technical Details

### File Detection Rules

**Includes:**
- `.tsx` and `.jsx` files
- Files that export React components

**Excludes:**
- `.test.*` files
- `.spec.*` files
- `.stories.*` files
- Files starting with `.`
- `node_modules`, `.next`, `dist`, `build` directories

### Props Detection

Detects these patterns:
```typescript
interface ComponentNameProps {
  // ...
}

type ComponentNameProps = {
  // ...
}
```

### Performance

- **Scan time:** ~500ms for 550+ components
- **No caching:** Always reflects current state
- **Server-side scanning:** Runs on API call, not build time

---

## Maintenance

### Zero Maintenance Required

This catalogue is **completely automatic**:
- No configuration files
- No manual component registration
- No imports needed
- Just add components to apps, they appear here

### Adding New Apps

To add a new app to the catalogue:

1. Edit `lib/component-scanner.ts`
2. Add to `APP_PATHS` object:
```typescript
const APP_PATHS = {
  // ... existing apps
  newapp: "/path/to/newapp/components",
};
```
3. Add to type:
```typescript
export interface ComponentInfo {
  app: "core" | "account" | "clavet" | "geargrabber" | "newapp";
  // ...
}
```

That's it!

---

## Benefits

### For Developers

- **Quick Reference:** Find any component instantly
- **Avoid Duplication:** See what exists before creating new components
- **Copy/Paste:** Get import statements ready to use
- **Cross-App Discovery:** Find components in other apps

### For Team

- **Visibility:** See all UI components in one place
- **Consistency:** Identify duplicate components across apps
- **Documentation:** Props interfaces shown inline
- **Onboarding:** New developers can browse all components

### For Codebase

- **Single Source of Truth:** One place to see all components
- **No Manual Updates:** Always current
- **Cross-App Patterns:** Identify opportunities for shared components

---

## Comparison to Old Catalogue

### Old (in crescender-core and clavet)

- ❌ Manual configuration
- ❌ Part of main app build
- ❌ Adds build overhead
- ❌ Limited to single app
- ❌ Requires manual updates

### New (complete-catalogue)

- ✅ Automatic discovery
- ✅ Standalone app (no build overhead)
- ✅ Runs locally only
- ✅ Covers all apps
- ✅ Zero maintenance

---

## Deployment

**This app is NOT deployed.** It runs locally only.

### Why Local Only?

1. **Development Tool:** Only useful during development
2. **File System Access:** Needs direct access to source files
3. **No Production Value:** Not needed for end users
4. **Security:** Shouldn't expose source code structure publicly

### Git Repository

This app should be:
- ✅ Committed to git
- ✅ Pushed to GitHub (in a separate repo or monorepo)
- ❌ NOT deployed to Vercel/production

---

## Future Enhancements

Possible additions:
- [ ] Component preview/rendering (tricky with external imports)
- [ ] Usage examples from source code
- [ ] Dependency graph (which components use which)
- [ ] Export statistics (component size, complexity)
- [ ] Duplicate detection (similar component names)
- [ ] Hot reload (watch file changes, update without refresh)

---

## Troubleshooting

### "Directory not found" errors

Check that paths in `APP_PATHS` are correct for your system.

### Components not appearing

1. Check file extension (must be `.tsx` or `.jsx`)
2. Check it's not excluded (test files, etc.)
3. Check `components` directory exists in that app

### Slow scanning

Normal for 500+ components. Optimize by:
- Excluding more directories
- Caching results (but loses real-time benefit)

---

## License

Part of the Crescender ecosystem. Internal use only.

## Contact

Questions? Check the main Crescender documentation or ask the team.

---

**Status:** Production Ready ✅  
**Version:** 1.0.0  
**Last Updated:** 5/Dec/2025  
**Maintainer:** Auto-maintained (zero manual work required)

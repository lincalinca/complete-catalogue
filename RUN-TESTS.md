# How to Run and Interrogate Gear Components

## Quick Start

### 1. Start Storybook
```bash
cd /Users/linc/Dev-Work/Crescender/complete-catalogue
npm run storybook
```

Wait for: "Storybook X.X.X for React started"
Open: http://localhost:6006

### 2. Navigate to Stories
- **EditableText**: http://localhost:6006/?path=/story/crescender-editabletext--async-save
- **EditableNumber**: http://localhost:6006/?path=/story/crescender-editablenumber--async-save
- **EditableBrand**: http://localhost:6006/?path=/story/crescender-editablebrand--async-save

### 3. Open Browser DevTools
- Press F12 or Cmd+Option+I
- Go to Console tab
- **Enable "Preserve log"** to catch all errors

### 4. Test Each Component

#### EditableText - Async Save
1. Click "Test Value"
2. Type "New Value"
3. Press Enter
4. **Watch console for errors**
5. Verify "Current value: New Value" appears

#### EditableText - Tab Navigation
1. Click "First Field"
2. Type "Updated First"
3. Press Tab
4. **Watch console for errors**
5. Verify second field is focused
6. Verify "Updated First" is saved

#### EditableNumber
1. Click "2001"
2. Type "2020"
3. Press Enter
4. **Watch console for errors**

### 5. Run Playwright Tests
```bash
# In a new terminal
cd /Users/linc/Dev-Work/Crescender/complete-catalogue
npm run test:e2e
```

This will:
- Start Storybook automatically
- Run all tests
- Report any `replaceChild` errors
- Generate HTML report

## What to Look For

### ✅ Success Indicators
- No errors in console
- Values save correctly
- Components exit edit mode cleanly
- Tab navigation works

### ❌ Error Indicators
- `TypeError: Cannot read properties of null (reading 'replaceChild')`
- Component stuck in edit mode
- Values not saving
- Tab navigation broken

## Debugging Tips

1. **Check Console First**
   - Look for `replaceChild` errors
   - Check error stack traces
   - Note timing of errors

2. **Test One Field at a Time**
   - Start with EditableText
   - Then EditableNumber
   - Then EditableBrand
   - Finally GearPrimaryHeroCard

3. **Test Edge Cases**
   - Rapid clicks
   - Tab during save
   - Click outside during save
   - Empty values

4. **Monitor Network Tab**
   - Verify API calls complete
   - Check for failed requests

## Reporting Issues

If you find errors, note:
1. **Which component** (EditableText, EditableNumber, etc.)
2. **What action** (click, type, Tab, etc.)
3. **Error message** (exact text from console)
4. **Stack trace** (if available)
5. **Timing** (when does it occur?)


# Gear Component Interrogation Plan

## Purpose
To systematically test and debug the editable gear components (EditableText, EditableNumber, EditableBrand, GearPrimaryHeroCard) to identify and fix the `replaceChild` error.

## Test Scenarios

### 1. EditableText - Async Save
**Setup:**
- Component with async `onSave` (simulates API call with 500ms delay)
- Initial value: "Test Value"

**Test Steps:**
1. Click the text to enter edit mode
2. Type "New Value"
3. Press Enter
4. Wait for "Saving..." to disappear
5. Verify value updated to "New Value"
6. **Check console for `replaceChild` errors**

**Expected:**
- ✅ Value saves correctly
- ✅ No `replaceChild` errors
- ✅ Component exits edit mode cleanly

### 2. EditableText - Tab Navigation
**Setup:**
- Two EditableText components in sequence

**Test Steps:**
1. Click first field
2. Type "Updated First"
3. Press Tab
4. Verify second field is focused
5. Verify first field shows "Updated First"
6. **Check console for `replaceChild` errors**

**Expected:**
- ✅ Tab navigation works
- ✅ First field saves before tab
- ✅ No `replaceChild` errors

### 3. EditableNumber - Async Save
**Test Steps:**
1. Click number field (value: 2001)
2. Type "2020"
3. Press Enter
4. Wait for save
5. **Check console for errors**

### 4. EditableBrand - Brand Selection
**Test Steps:**
1. Click brand field
2. Wait for popover to open
3. Select a brand from dropdown
4. Wait for async save
5. **Check console for `replaceChild` errors**

**Expected:**
- ✅ Brand saves correctly
- ✅ Popover closes cleanly
- ✅ No `replaceChild` errors

### 5. GearPrimaryHeroCard - Full Integration
**Test Steps:**
1. Update Brand field
2. Update Model field
3. Update Year field
4. Update Colour field
5. **Monitor console throughout**

**Expected:**
- ✅ All fields save correctly
- ✅ No errors during any update
- ✅ Component remains stable

## Error Detection

### Console Monitoring
- Capture all `console.error` calls
- Capture all `pageerror` events
- Filter for:
  - `replaceChild`
  - `Cannot read properties of null`
  - `TypeError`

### What to Look For
1. **Timing Issues:**
   - Errors that occur during async operations
   - Errors that occur during state updates
   - Errors that occur during DOM updates

2. **Race Conditions:**
   - Multiple rapid clicks
   - Tab navigation during save
   - Click outside during save

3. **State Conflicts:**
   - Parent re-render during child state update
   - Component unmount during async operation

## Debugging Strategy

1. **Run Storybook** - Visual inspection
2. **Run Playwright Tests** - Automated verification
3. **Check Console Logs** - Error detection
4. **Add Breakpoints** - Step through async operations
5. **Monitor Network** - Verify API calls complete

## Success Criteria

✅ All tests pass
✅ No `replaceChild` errors in console
✅ All fields save correctly
✅ Tab navigation works
✅ Brand selection works
✅ Rapid interactions don't cause errors


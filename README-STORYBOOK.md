# Storybook & Playwright E2E Testing Setup

This project now includes Storybook for component development and Playwright for E2E testing of editable components.

## Setup

### Prerequisites
- Node.js 20.17+ (currently using 20.17.0)
- npm

### Installation
Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

## Running Storybook

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006`

## Running E2E Tests

### Run all tests
```bash
npm run test:e2e
```

### Run tests with UI
```bash
npm run test:e2e:ui
```

## What's Included

### Storybook Stories
- **EditableText** - Tests async save behavior, Tab navigation, and rapid interactions
- More stories can be added for EditableNumber, EditableBrand, etc.

### Playwright Tests
Located in `tests/editable-components.spec.ts`:
- Async save without replaceChild errors
- Tab navigation between fields
- Rapid click handling
- Brand selection (placeholder for future implementation)

## Testing the Fixes

The E2E tests specifically verify:
1. ✅ Async saves complete without `replaceChild` errors
2. ✅ Tab navigation works correctly
3. ✅ Rapid interactions don't cause race conditions
4. ✅ Console errors are monitored and reported

## Adding New Stories

1. Create a new file in `stories/` directory
2. Import components from `@/components/ui/...`
3. Use `@storybook/test` for interactive testing
4. Add corresponding Playwright tests in `tests/`

## Configuration

- **Storybook config**: `.storybook/main.ts`
- **Playwright config**: `.storybook/test-runner.ts`
- **Component paths**: Configured to access `crescender-core/components`

## Troubleshooting

### Storybook won't start
- Check Node.js version: `node --version` (needs 20.17+)
- Clear cache: `rm -rf node_modules/.cache`

### Tests fail
- Ensure Storybook is running: `npm run storybook`
- Check Playwright installation: `npx playwright install`

### Import errors
- Verify path aliases in `.storybook/main.ts`
- Check that `crescender-core` is accessible from this directory


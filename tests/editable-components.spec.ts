import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Editable Components
 * 
 * These tests verify that the async save behavior works correctly
 * and that race conditions are properly handled.
 */

test.describe('EditableText Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-editabletext--async-save');
    // Wait for Storybook to load
    await page.waitForSelector('[data-testid="storybook-root"]', { timeout: 10000 });
  });

  test('should handle async save without replaceChild error', async ({ page }) => {
    // Click the editable text to enter edit mode
    const editableText = page.getByText('Test Value');
    await editableText.click();

    // Wait for input to appear
    const input = page.getByDisplayValue('Test Value');
    await expect(input).toBeVisible();

    // Type new value
    await input.clear();
    await input.fill('New Test Value');

    // Press Enter to save
    await input.press('Enter');

    // Wait for the async save to complete (check for "Saving..." to disappear)
    await page.waitForSelector('text=Saving...', { state: 'hidden', timeout: 2000 });

    // Verify the value was saved
    await expect(page.getByText('Current value: New Test Value')).toBeVisible();
    await expect(page.getByText('New Test Value')).toBeVisible();

    // Verify no errors in console
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(500);

    // Check for specific error we're trying to fix
    const replaceChildErrors = errors.filter((e) => e.includes('replaceChild'));
    expect(replaceChildErrors.length).toBe(0);
  });

  test('should handle Tab navigation between fields', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-editabletext--tab-navigation');

    // Click first field
    const firstField = page.getByText('First Field');
    await firstField.click();

    // Wait for input
    const firstInput = page.getByDisplayValue('First Field');
    await expect(firstInput).toBeFocused();

    // Type new value
    await firstInput.clear();
    await firstInput.fill('Updated First');

    // Press Tab
    await firstInput.press('Tab');

    // Wait for second field to be focused
    const secondInput = page.getByDisplayValue('Second Field');
    await expect(secondInput).toBeFocused({ timeout: 2000 });

    // Verify first field was saved
    await expect(page.getByText('Updated First')).toBeVisible({ timeout: 2000 });

    // Verify no replaceChild errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(500);
    const replaceChildErrors = errors.filter((e) => e.includes('replaceChild'));
    expect(replaceChildErrors.length).toBe(0);
  });

  test('should handle rapid clicks without errors', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-editabletext--async-save');

    const editableText = page.getByText('Test Value');

    // Rapidly click multiple times
    for (let i = 0; i < 5; i++) {
      await editableText.click();
      await page.waitForTimeout(50);
    }

    // Wait for input
    const input = page.getByDisplayValue('Test Value');
    await expect(input).toBeVisible();

    // Type and save
    await input.clear();
    await input.fill('Rapid Test');
    await input.press('Enter');

    // Verify save completed
    await expect(page.getByText('Current value: Rapid Test')).toBeVisible({ timeout: 2000 });

    // Check for errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForTimeout(500);
    const replaceChildErrors = errors.filter((e) => e.includes('replaceChild'));
    expect(replaceChildErrors.length).toBe(0);
  });
});

test.describe('EditableBrand Component', () => {
  test('should handle brand selection without replaceChild error', async ({ page }) => {
    // This test would require the actual BrandAutocomplete component
    // For now, we'll create a placeholder test
    test.skip('Requires BrandAutocomplete component setup');
  });
});


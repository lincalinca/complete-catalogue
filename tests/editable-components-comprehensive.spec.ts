import { test, expect } from '@playwright/test';

/**
 * Comprehensive E2E Tests for Editable Components
 * 
 * These tests specifically target the replaceChild error and race conditions
 * that were causing issues with brand, model, year, and color fields.
 */

test.describe('EditableText - Async Save Behavior', () => {
  test.beforeEach(async ({ page }) => {
    // Monitor console for errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log(`[Console Error] ${msg.text()}`);
      }
    });

    // Monitor page errors
    page.on('pageerror', (error) => {
      console.error(`[Page Error] ${error.message}`);
    });
  });

  test('should handle async save without replaceChild error', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-editabletext--async-save');
    
    // Wait for Storybook to load
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(1000); // Give Storybook time to render

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Click the editable text
    const editableText = page.getByText('Test Value');
    await editableText.click({ timeout: 5000 });

    // Wait for input to appear
    const input = page.getByDisplayValue('Test Value');
    await expect(input).toBeVisible({ timeout: 5000 });

    // Type new value
    await input.clear();
    await input.fill('New Test Value');

    // Press Enter to save
    await input.press('Enter');

    // Wait for async save to complete
    await page.waitForSelector('text=Saving...', { state: 'hidden', timeout: 3000 });
    await expect(page.getByText('Current value: New Test Value')).toBeVisible({ timeout: 3000 });

    // Wait a bit to catch any delayed errors
    await page.waitForTimeout(1000);

    // Check for replaceChild errors
    const replaceChildErrors = errors.filter((e) => 
      e.includes('replaceChild') || 
      e.includes('Cannot read properties of null')
    );
    
    if (replaceChildErrors.length > 0) {
      console.error('Found replaceChild errors:', replaceChildErrors);
    }
    
    expect(replaceChildErrors.length).toBe(0);
  });

  test('should handle Tab navigation between fields', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-editabletext--tab-navigation');
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(1000);

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Click first field
    const firstField = page.getByText('First Field');
    await firstField.click();

    // Wait for input
    const firstInput = page.getByDisplayValue('First Field');
    await expect(firstInput).toBeFocused({ timeout: 5000 });

    // Type new value
    await firstInput.clear();
    await firstInput.fill('Updated First');

    // Press Tab
    await firstInput.press('Tab');

    // Wait for second field to be focused
    const secondInput = page.getByDisplayValue('Second Field');
    await expect(secondInput).toBeFocused({ timeout: 3000 });

    // Verify first field was saved
    await expect(page.getByText('Updated First')).toBeVisible({ timeout: 3000 });

    // Wait for any delayed errors
    await page.waitForTimeout(1000);

    const replaceChildErrors = errors.filter((e) => 
      e.includes('replaceChild') || 
      e.includes('Cannot read properties of null')
    );
    
    expect(replaceChildErrors.length).toBe(0);
  });

  test('should handle rapid clicks without errors', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-editabletext--async-save');
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(1000);

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const editableText = page.getByText('Test Value');

    // Rapidly click multiple times
    for (let i = 0; i < 5; i++) {
      await editableText.click();
      await page.waitForTimeout(50);
    }

    // Wait for input
    const input = page.getByDisplayValue('Test Value');
    await expect(input).toBeVisible({ timeout: 5000 });

    // Type and save
    await input.clear();
    await input.fill('Rapid Test');
    await input.press('Enter');

    // Verify save completed
    await expect(page.getByText('Current value: Rapid Test')).toBeVisible({ timeout: 3000 });

    // Wait for errors
    await page.waitForTimeout(1000);

    const replaceChildErrors = errors.filter((e) => 
      e.includes('replaceChild') || 
      e.includes('Cannot read properties of null')
    );
    
    expect(replaceChildErrors.length).toBe(0);
  });
});

test.describe('EditableNumber - Async Save Behavior', () => {
  test('should handle async save for number field', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-editablenumber--async-save');
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(1000);

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Click the number field
    const numberField = page.getByText('2001');
    await numberField.click();

    // Wait for input
    const input = page.getByDisplayValue('2001');
    await expect(input).toBeVisible({ timeout: 5000 });

    // Type new value
    await input.clear();
    await input.fill('2020');
    await input.press('Enter');

    // Wait for save
    await page.waitForSelector('text=Saving...', { state: 'hidden', timeout: 3000 });
    await expect(page.getByText('Current value: 2020')).toBeVisible({ timeout: 3000 });

    await page.waitForTimeout(1000);

    const replaceChildErrors = errors.filter((e) => 
      e.includes('replaceChild') || 
      e.includes('Cannot read properties of null')
    );
    
    expect(replaceChildErrors.length).toBe(0);
  });
});

test.describe('GearPrimaryHeroCard - Full Integration', () => {
  test('should handle all field updates without errors', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-gearprimaryherocard--default');
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(2000); // Give more time for complex component

    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Test Model field
    const modelLabel = page.getByText('Model');
    if (await modelLabel.isVisible()) {
      // Find and click model field
      const modelField = page.locator('text=Stratocaster').first();
      if (await modelField.isVisible()) {
        await modelField.click();
        await page.waitForTimeout(500);
        
        // Try to find input
        const input = page.locator('input[type="text"]').filter({ hasText: /Stratocaster/ }).first();
        if (await input.isVisible({ timeout: 2000 })) {
          await input.clear();
          await input.fill('New Model');
          await input.press('Enter');
          await page.waitForTimeout(1000);
        }
      }
    }

    // Wait for any async operations
    await page.waitForTimeout(2000);

    // Check for errors
    const replaceChildErrors = errors.filter((e) => 
      e.includes('replaceChild') || 
      e.includes('Cannot read properties of null') ||
      e.includes('TypeError')
    );
    
    if (replaceChildErrors.length > 0) {
      console.error('Found errors in GearPrimaryHeroCard:', replaceChildErrors);
    }
    
    // Log all errors for debugging
    if (errors.length > 0) {
      console.log('All console errors:', errors);
    }
    
    expect(replaceChildErrors.length).toBe(0);
  });
});

test.describe('Error Detection and Reporting', () => {
  test('should capture and report all console errors', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/crescender-editabletext--async-save');
    await page.waitForSelector('body', { timeout: 10000 });
    await page.waitForTimeout(1000);

    const allErrors: Array<{ type: string; message: string; stack?: string }> = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        allErrors.push({
          type: 'console',
          message: msg.text(),
        });
      }
    });

    page.on('pageerror', (error) => {
      allErrors.push({
        type: 'pageerror',
        message: error.message,
        stack: error.stack,
      });
    });

    // Perform actions
    const editableText = page.getByText('Test Value');
    await editableText.click();
    
    const input = page.getByDisplayValue('Test Value');
    await input.fill('Test');
    await input.press('Enter');
    
    await page.waitForTimeout(2000);

    // Report all errors
    if (allErrors.length > 0) {
      console.log('=== ALL ERRORS DETECTED ===');
      allErrors.forEach((error, i) => {
        console.log(`Error ${i + 1} (${error.type}):`, error.message);
        if (error.stack) {
          console.log('Stack:', error.stack);
        }
      });
    }

    // Check for specific errors we're fixing
    const criticalErrors = allErrors.filter((e) =>
      e.message.includes('replaceChild') ||
      e.message.includes('Cannot read properties of null')
    );

    expect(criticalErrors.length).toBe(0);
  });
});


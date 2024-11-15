import { test, expect } from '@playwright/test';

test.describe('Environment Management Commands', () => {
  test('permit env select', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=permit env select');
    await page.waitForSelector('text=Select an environment');
    expect(await page.textContent('text=Select an environment')).toBeTruthy();
  });

  test('permit env copy', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=permit env copy');
    await page.waitForSelector('text=Copying environment...');
    expect(await page.textContent('text=Copying environment...')).toBeTruthy();
  });

  test('permit env member', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.click('text=permit env member');
    await page.waitForSelector('text=Adding member...');
    expect(await page.textContent('text=Adding member...')).toBeTruthy();
  });
});

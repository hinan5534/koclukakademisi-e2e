import { test } from '@playwright/test';
import { ROUTES } from '../../utils/constants';

test('Setup — auth.json oluştur', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL || 'hasan@gmail.com';
  const password = process.env.TEST_USER_PASSWORD || '';

  await page.goto(ROUTES.LOGIN);
  await page.waitForLoadState('domcontentloaded');
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL((url) => !url.toString().includes(ROUTES.LOGIN), {
    timeout: 20_000,
  });
  await page.context().storageState({ path: 'auth.json' });
});

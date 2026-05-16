import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ permissions: ['notifications'] });
  const page = await context.newPage();
  await page.goto('https://koclukakademisi.com/giris');
  
  // Manuel giriş için bekle
  console.log('Giriş yapın, sonra Enter a basin...');
  await new Promise(resolve => process.stdin.once('data', resolve));
  
  await context.storageState({ path: 'auth.json' });
  console.log('auth.json kaydedildi!');
  await browser.close();
})();

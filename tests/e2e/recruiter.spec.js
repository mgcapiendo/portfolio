import { expect, test } from '@playwright/test';

// The 30-second recruiter path: name, roles, resume and contact are on the
// first screen, and the page never scrolls sideways.
test('portfolio page shows the essentials on load', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Capiendo');
  await expect(page.getByRole('list', { name: 'Target roles' })).toContainText('Software Engineer');
  await expect(page.locator('.hud').getByRole('link', { name: /Resume/ })).toBeVisible();
  await expect(page.locator('#experience .role-list > li')).toHaveCount(6);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

// mailto: does nothing without a default mail app, so the email buttons also
// copy the address and say so. The mail app still gets its chance to open.
test('email me copies the address and still opens mail', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/');

  const mailto = page.waitForRequest((request) => request.url().startsWith('mailto:'));
  await page.getByRole('link', { name: 'Email me' }).click();
  await mailto;

  await expect(page.getByRole('status').filter({ hasText: 'Email address copied' })).toBeVisible();
  await expect(page.locator('.hero').getByRole('link', { name: 'Email copied' })).toBeVisible();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toBe('manuelgcapiendo@gmail.com');

  await expect(page.locator('.hero').getByRole('link', { name: 'Email me' })).toBeVisible({ timeout: 5000 });
});

test('the contact Copy button shows the same copied message', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#contact');

  await page.locator('#contact').getByRole('button', { name: 'Copy' }).click();

  await expect(page.getByRole('status').filter({ hasText: 'Email address copied' })).toBeVisible();
  await expect(page.locator('#contact').getByRole('button', { name: 'Copied!' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('manuelgcapiendo@gmail.com');
});

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

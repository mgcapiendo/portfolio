import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// Automated accessibility audit (axe). Fails on serious or critical issues.
const audit = async (page, include) => {
  const builder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
  if (include) builder.include(include);
  const results = await builder.analyze();
  const blocking = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  const summary = blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) -> ${v.nodes[0]?.target}`);
  expect(summary, summary.join('\n')).toEqual([]);
};

test('portfolio page has no serious accessibility issues', async ({ page }) => {
  await page.goto('/');
  await audit(page);
});

test('park controls, exhibit panel and map have no serious accessibility issues', async ({ page }) => {
  await page.goto('/#park');
  const park = page.getByRole('region', { name: /Choktopia/ });
  await expect(park.locator('canvas')).toBeVisible({ timeout: 10_000 });
  await expect(park.locator('.park-prompt')).toBeVisible({ timeout: 5_000 });
  await audit(page, '.park');

  await park.locator('.park-prompt').getByRole('button', { name: /Read/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await audit(page, '.park');
  await page.keyboard.press('Escape');

  await park.getByRole('button', { name: /^Map/ }).click();
  await expect(page.getByRole('dialog', { name: 'Where to?' })).toBeVisible();
  await audit(page, '.park');
});

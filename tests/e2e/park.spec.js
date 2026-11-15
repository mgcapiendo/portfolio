import { expect, test } from '@playwright/test';
import { EXHIBITS } from '../../src/game/map.js';

const openPark = async (page, hash = '#park') => {
  await page.goto(`/${hash}`);
  const park = page.getByRole('region', { name: /Choktopia/ });
  await expect(park.locator('canvas')).toBeVisible({ timeout: 10_000 });
  return park;
};

test.describe('Choktopia park (desktop)', () => {
  test.skip(({ isMobile }) => isMobile, 'keyboard tests run on desktop');

  test('enter from the hero, read the Visitor Center, and leave', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Explore Choktopia/ }).click();
    await expect(page).toHaveURL(/#park$/);
    const park = page.getByRole('region', { name: /Choktopia/ });
    await expect(park.locator('canvas')).toBeVisible({ timeout: 10_000 });

    // The ranger spawns right outside the Visitor Center door.
    await expect(park.locator('.park-prompt')).toContainText('Visitor Center', { timeout: 5_000 });
    await page.keyboard.press('e');
    const panel = page.getByRole('dialog', { name: 'Welcome to Choktopia' });
    await expect(panel).toContainText('Florida Atlantic University');
    await expect(page).toHaveURL(/#park\/visitor-center$/);

    // Esc closes the panel, then Esc again leaves the park.
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
    await page.keyboard.press('Escape');
    await expect(park).toBeHidden();
    await expect(page).not.toHaveURL(/#park/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('walking moves the ranger away from an exhibit', async ({ page }) => {
    const park = await openPark(page);
    const prompt = park.locator('.park-prompt');
    await expect(prompt).toContainText('Visitor Center', { timeout: 5_000 });
    await page.keyboard.down('ArrowLeft');
    await expect(prompt).toBeHidden({ timeout: 3_000 });
    await page.keyboard.up('ArrowLeft');
  });

  test('fast travel with the map and collect a stamp', async ({ page }) => {
    const park = await openPark(page);
    await page.keyboard.press('m');
    const map = page.getByRole('dialog', { name: 'Where to?' });
    await expect(map).toBeVisible();
    await map.getByRole('button', { name: 'T. rex paddock', exact: true }).click();
    await expect(map).toBeHidden();

    await expect(park.locator('.park-prompt')).toContainText('T. rex paddock');
    await page.keyboard.press('e');
    await expect(page.getByRole('dialog', { name: 'Technical Solutions Architect Intern' })).toBeVisible();
    await expect(park.locator('.park-stamps')).toContainText(`1/${EXHIBITS.length}`);
  });

  test('click a pin on the picture map to travel', async ({ page }) => {
    const park = await openPark(page);
    await page.keyboard.press('m');
    const map = page.getByRole('dialog', { name: 'Where to?' });
    await expect(map.locator('.park-map-img')).toBeVisible();
    await expect(map.locator('.map-you')).toBeVisible();
    await map.getByRole('button', { name: 'Travel to Brachiosaurus field' }).click();
    await expect(map).toBeHidden();
    await expect(park.locator('.park-prompt')).toContainText('Brachiosaurus field');
  });

  test('every exhibit opens a panel, and the last stamp shows the completion card', async ({ page }) => {
    test.setTimeout(90_000);
    const park = await openPark(page);
    for (const [i, exhibit] of EXHIBITS.entries()) {
      await page.keyboard.press('m');
      await page
        .getByRole('dialog', { name: 'Where to?' })
        .getByRole('button', { name: exhibit.name, exact: true })
        .click();
      await expect(park.locator('.park-prompt'), exhibit.id).toContainText(exhibit.name);
      await page.keyboard.press('e');
      const panel = park.locator('[aria-labelledby="exhibit-title"]');
      await expect(panel.locator('#exhibit-title'), exhibit.id).not.toHaveText(exhibit.name);
      await page.keyboard.press('Escape');
      await expect(panel).toBeHidden();
      if (i < EXHIBITS.length - 1) await expect(park.getByRole('dialog')).toBeHidden();
    }
    await expect(park.locator('.park-stamps')).toContainText(`${EXHIBITS.length}/${EXHIBITS.length}`);

    const done = page.getByRole('dialog', { name: 'Every stamp collected!' });
    await expect(done).toBeVisible();
    await expect(done.getByRole('link', { name: /View resume/ })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(done).toBeHidden();
  });

  test('clicking a sign walks there along the path and opens it', async ({ page }) => {
    const park = await openPark(page);
    await expect(park.locator('.park-prompt')).toContainText('Visitor Center', { timeout: 5_000 });
    await page.waitForTimeout(800); // let the camera settle on the spawn point

    // Same camera math as ParkScene: whole-number zoom, follow offset 28 px,
    // clamped to the world. Spawn feet are at (512, 904); world is 1024 x 976.
    const box = await park.locator('canvas').boundingBox();
    const zoom = Math.max(2, Math.round(Math.min(box.width, box.height) / 240));
    const camX = Math.min(Math.max(512, box.width / zoom / 2), 1024 - box.width / zoom / 2);
    const camY = Math.min(Math.max(896 - 28, box.height / zoom / 2), 976 - box.height / zoom / 2);
    const toScreen = (wx, wy) => [
      box.x + box.width / 2 + (wx - camX) * zoom,
      box.y + box.height / 2 + (wy - camY) * zoom,
    ];

    const sign = EXHIBITS.find((e) => e.id === 'news').sign;
    await page.mouse.click(...toScreen(sign[0] * 16 + 8, sign[1] * 16 + 8));
    await expect(page.getByRole('dialog', { name: /Sea turtle rescue/ })).toBeVisible({ timeout: 6_000 });
  });
});

test('a deep link opens the park at that exhibit', async ({ page }) => {
  await openPark(page, '#park/lagoon');
  await expect(page.getByRole('dialog', { name: 'Grant Compliance Assistant' })).toBeVisible();
});

test('the park still works with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const park = await openPark(page);
  await expect(park.locator('.park-prompt')).toContainText('Visitor Center', { timeout: 5_000 });
  await park.locator('.park-prompt').getByRole('button', { name: /Read/ }).click();
  await expect(page.getByRole('dialog', { name: 'Welcome to Choktopia' })).toBeVisible();
});

test('phones can read an exhibit with the on-screen button', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'touch test');
  const park = await openPark(page);
  const prompt = park.locator('.park-prompt');
  await expect(prompt).toContainText('Visitor Center', { timeout: 5_000 });
  await prompt.getByRole('button', { name: /Read/ }).tap();
  await expect(page.getByRole('dialog', { name: 'Welcome to Choktopia' })).toBeVisible();
});

test('footsteps play while walking, only when sound is on', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard walk');
  // Count footstep sound sources (each step creates one noise buffer source).
  await page.addInitScript(() => {
    window.__steps = 0;
    const original = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function count(...args) {
      window.__steps += 1;
      return original.apply(this, args);
    };
  });
  const park = await openPark(page);
  const walk = async () => {
    await page.keyboard.down('ArrowLeft');
    await page.waitForTimeout(1200);
    await page.keyboard.up('ArrowLeft');
  };

  await walk();
  expect(await page.evaluate(() => window.__steps)).toBe(0);

  await park.getByRole('button', { name: 'Sound: off' }).click();
  await expect(park.getByRole('button', { name: 'Sound: on' })).toBeVisible();
  await page.keyboard.press('ArrowRight'); // focus back on the game, not the button
  await walk();
  expect(await page.evaluate(() => window.__steps)).toBeGreaterThan(2);
});

test('on a phone, tapping a sign walks there along the path and opens it', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'touch test');
  const park = await openPark(page);
  await expect(park.locator('.park-prompt')).toContainText('Visitor Center', { timeout: 5_000 });
  await page.waitForTimeout(800); // let the camera settle on the spawn point

  // Same camera math as ParkScene (see the desktop version of this test).
  const box = await park.locator('canvas').boundingBox();
  const zoom = Math.max(2, Math.round(Math.min(box.width, box.height) / 240));
  const camX = Math.min(Math.max(512, box.width / zoom / 2), 1024 - box.width / zoom / 2);
  const camY = Math.min(Math.max(896 - 28, box.height / zoom / 2), 976 - box.height / zoom / 2);
  const sign = EXHIBITS.find((e) => e.id === 'news').sign;
  const x = box.x + box.width / 2 + (sign[0] * 16 + 8 - camX) * zoom;
  const y = box.y + box.height / 2 + (sign[1] * 16 + 8 - camY) * zoom;

  await page.touchscreen.tap(x, y);
  await expect(page.getByRole('dialog', { name: /Sea turtle rescue/ })).toBeVisible({ timeout: 6_000 });
});

test('on a phone, the picture map pins travel with a tap', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'touch test');
  const park = await openPark(page);
  await park.getByRole('button', { name: /^Map/ }).tap();
  const map = page.getByRole('dialog', { name: 'Where to?' });
  await expect(map.locator('.park-map-img')).toBeVisible();
  await map.getByRole('button', { name: 'Travel to Pteranodon aviary' }).tap();
  await expect(park.locator('.park-prompt')).toContainText('Pteranodon aviary');
});

const { test, expect } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

const appUrl = pathToFileURL(path.join(__dirname, '..', 'index.html')).toString();

function solve(problemText) {
  const match = problemText.match(/(\d+)\s*([+−×÷])\s*(\d+)/);
  if (!match) throw new Error(`Unexpected problem format: ${problemText}`);

  const a = Number(match[1]);
  const op = match[2];
  const b = Number(match[3]);

  if (op === '+') return a + b;
  if (op === '−') return a - b;
  if (op === '×') return a * b;
  if (op === '÷') return a / b;
  throw new Error(`Unsupported operator: ${op}`);
}

test('shows start screen initially', async ({ page }) => {
  await page.goto(appUrl);

  await expect(page.getByRole('heading', { name: 'Kopfrechnen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Spiel starten' })).toBeVisible();
});

test('starts game and shows first problem', async ({ page }) => {
  await page.goto(appUrl);
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  await expect(page.locator('#game-screen')).toBeVisible();
  await expect(page.locator('#problem')).toContainText('=');
  await expect(page.locator('#score')).toHaveText('0');
});

test('increments score for a correct answer', async ({ page }) => {
  await page.goto(appUrl);
  await page.getByRole('button', { name: 'Spiel starten' }).click();

  const problem = await page.locator('#problem').textContent();
  const answer = solve(problem || '');

  await page.locator('#answer').type(String(answer));
  await expect(page.locator('#feedback')).toContainText('Richtig');
  await expect(page.locator('#score')).toHaveText('1');
});

import { test, expect, type Locator, type Page } from "@playwright/test";

async function dragTo(page: Page, source: Locator, target: Locator) {
  const src = await source.boundingBox();
  const dst = await target.boundingBox();
  if (!src || !dst) throw new Error("Cannot get bounding boxes");
  const sx = src.x + src.width / 2;
  const sy = src.y + src.height / 2;
  const dx = dst.x + dst.width / 2;
  const dy = dst.y + dst.height / 2;

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 12, sy + 12, { steps: 5 });
  await page.mouse.move(dx, dy, { steps: 20 });
  await page.mouse.move(dx, dy, { steps: 5 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Kanban Board" })).toBeVisible();
});

test("loads with five columns and seed cards", async ({ page }) => {
  await expect(page.getByTestId("column")).toHaveCount(5);
  await expect(page.getByText("Define Q3 roadmap")).toBeVisible();
  await expect(page.getByText("Build drag-and-drop interactions")).toBeVisible();
});

test("renames a column inline", async ({ page }) => {
  await page.getByTestId("column-title").nth(1).click();
  const input = page.getByLabel("Rename column To Do");
  await input.fill("Now");
  await input.press("Enter");
  await expect(page.getByTestId("column-title").nth(1)).toHaveText("Now");
});

test("adds a new card", async ({ page }) => {
  const backlog = page.getByTestId("column").first();
  await backlog.getByTestId("add-card-button").click();
  await page.getByLabel("Card title").fill("Plan offsite");
  await page.getByLabel("Card details").fill("Pick venue and date.");
  await page.getByRole("button", { name: "Add", exact: true }).click();
  await expect(backlog.getByText("Plan offsite")).toBeVisible();
});

test("deletes a card", async ({ page }) => {
  const card = page.getByText("Define Q3 roadmap");
  await expect(card).toBeVisible();
  await card.hover();
  await page.getByLabel("Delete card Define Q3 roadmap").click();
  await expect(page.getByText("Define Q3 roadmap")).toHaveCount(0);
});

test("reorders a card within the same column", async ({ page }) => {
  const backlog = page.getByTestId("column").first();
  const cards = backlog.getByTestId("card");
  await expect(cards.first()).toContainText("Define Q3 roadmap");

  await dragTo(
    page,
    cards.first(),
    cards.nth(1),
  );

  await expect(backlog.getByTestId("card").first()).toContainText(
    "Customer interview synthesis",
  );
});

test("moves a card across columns", async ({ page }) => {
  const backlog = page.getByTestId("column").first();
  const progress = page.getByTestId("column").nth(2);

  const sourceCard = backlog.getByText("Define Q3 roadmap");
  await dragTo(page, sourceCard, progress);

  await expect(backlog.getByText("Define Q3 roadmap")).toHaveCount(0);
  await expect(progress.getByText("Define Q3 roadmap")).toBeVisible();
});

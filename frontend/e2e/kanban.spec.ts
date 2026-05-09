import { expect, test, type Locator, type Page } from "@playwright/test";

async function dragBetweenLocators(page: Page, source: Locator, target: Locator) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  expect(sourceBox).not.toBeNull();
  expect(targetBox).not.toBeNull();

  const startX = sourceBox!.x + sourceBox!.width / 2;
  const startY = sourceBox!.y + sourceBox!.height / 2;
  const endX = targetBox!.x + targetBox!.width / 2;
  const endY = targetBox!.y + targetBox!.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 12, startY + 12, { steps: 4 });
  await page.mouse.move(endX, endY, { steps: 24 });
  await page.mouse.up();
}

test("supports the complete MVP workflow", async ({ page, isMobile }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Kanban Project Manager" }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(5);
  await expect(page.getByText("Shape project brief")).toBeVisible();

  const ideasColumn = page.getByTestId("column-ideas");
  await ideasColumn.getByRole("button", { name: "Add card to Ideas" }).click();
  await ideasColumn.getByLabel("Card title").fill("Prepare launch notes");
  await ideasColumn
    .getByLabel("Card details")
    .fill("Summarize the final MVP behavior for review.");
  await ideasColumn.getByRole("button", { name: "Add" }).press("Enter");
  await expect(page.getByText("Prepare launch notes")).toBeVisible();

  await ideasColumn.locator("#ideas-input").fill("Backlog");
  await expect(ideasColumn.locator("#ideas-input")).toHaveValue("Backlog");

  if (!isMobile) {
    await dragBetweenLocators(
      page,
      page.locator('[data-card-id="card-brief"] [data-drag-handle]'),
      page.locator('[data-card-id="card-kickoff"]'),
    );
    await expect(
      page.getByTestId("column-done").getByText("Shape project brief"),
    ).toBeVisible();
  }

  await page.getByRole("button", { name: "Delete Prepare launch notes" }).click();
  await expect(page.getByText("Prepare launch notes")).toHaveCount(0);

  if (isMobile) {
    await page.getByTestId("column-done").scrollIntoViewIfNeeded();
    await expect(page.getByTestId("column-done")).toBeVisible();
  }
});

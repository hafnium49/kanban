import { expect, test } from "@playwright/test";

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
  await ideasColumn.getByRole("button", { name: "Add" }).click();
  await expect(page.getByText("Prepare launch notes")).toBeVisible();

  await ideasColumn.getByDisplayValue("Ideas").fill("Backlog");
  await expect(ideasColumn.getByDisplayValue("Backlog")).toBeVisible();

  await page
    .locator('[data-card-id="card-brief"] [data-drag-handle]')
    .dragTo(page.getByTestId("column-done"));
  await expect(page.getByTestId("column-done").getByText("Shape project brief"))
    .toBeVisible();

  await page.getByRole("button", { name: "Delete Prepare launch notes" }).click();
  await expect(page.getByText("Prepare launch notes")).toHaveCount(0);

  if (isMobile) {
    await expect(page.getByTestId("column-done")).toBeVisible();
  }
});

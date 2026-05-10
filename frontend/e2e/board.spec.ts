import { test, expect } from "@playwright/test";

test.describe("Kanban Board", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads with 5 columns and correct titles", async ({ page }) => {
    await expect(page.getByText("Project Board")).toBeVisible();

    const expectedTitles = ["Backlog", "To Do", "In Progress", "Review", "Done"];
    for (let i = 0; i < expectedTitles.length; i++) {
      await expect(page.getByTestId(`column-title-col-${i + 1}`)).toContainText(expectedTitles[i], {
        ignoreCase: true,
      });
    }
  });

  test("each column shows a card count", async ({ page }) => {
    for (let i = 1; i <= 5; i++) {
      await expect(page.getByTestId(`column-count-col-${i}`)).toHaveText("2");
    }
  });

  test("can add a new card to a column", async ({ page }) => {
    await page.getByTestId("add-card-btn-col-1").click();
    await page.getByTestId("add-card-title-input").fill("New test card");
    await page.getByTestId("add-card-details-input").fill("Some details");
    await page.getByTestId("add-card-save").click();

    await expect(page.getByText("New test card")).toBeVisible();
    await expect(page.getByTestId("column-count-col-1")).toHaveText("3");
  });

  test("prevents adding card with empty title", async ({ page }) => {
    await page.getByTestId("add-card-btn-col-1").click();
    await page.getByTestId("add-card-save").click();

    // Form should still be visible (not submitted)
    await expect(page.getByTestId("add-card-title-input")).toBeVisible();
    // Count should not change
    await expect(page.getByTestId("column-count-col-1")).toHaveText("2");
  });

  test("can cancel adding a card", async ({ page }) => {
    await page.getByTestId("add-card-btn-col-1").click();
    await expect(page.getByTestId("add-card-title-input")).toBeVisible();

    await page.getByTestId("add-card-cancel").click();
    await expect(page.getByTestId("add-card-title-input")).not.toBeVisible();
  });

  test("can delete a card", async ({ page }) => {
    const cardText = "Define project scope";
    await expect(page.getByText(cardText)).toBeVisible();

    await page.getByTestId("delete-card-1").click({ force: true });

    await expect(page.getByText(cardText)).not.toBeVisible();
    await expect(page.getByTestId("column-count-col-1")).toHaveText("1");
  });

  test("can rename a column by double-clicking", async ({ page }) => {
    const titleEl = page.getByTestId("column-title-col-1");
    await titleEl.dblclick();

    const input = page.getByTestId("column-title-input-col-1");
    await expect(input).toBeVisible();
    await input.fill("Renamed Column");
    await input.press("Enter");

    await expect(page.getByTestId("column-title-col-1")).toContainText("Renamed Column", {
      ignoreCase: true,
    });
  });

  test("can drag a card to another column", async ({ page }) => {
    const card = page.getByTestId("card-card-1");
    const destColumn = page.getByTestId("column-col-2");

    // Verify initial state
    await expect(page.getByTestId("column-count-col-1")).toHaveText("2");
    await expect(page.getByTestId("column-count-col-2")).toHaveText("2");

    // Perform drag
    const cardBox = await card.boundingBox();
    const destBox = await destColumn.boundingBox();

    if (cardBox && destBox) {
      await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(destBox.x + destBox.width / 2, destBox.y + destBox.height / 2, { steps: 10 });
      await page.mouse.up();
    }

    // After drag: source should have 1, dest should have 3
    await expect(page.getByTestId("column-count-col-1")).toHaveText("1");
    await expect(page.getByTestId("column-count-col-2")).toHaveText("3");
  });
});

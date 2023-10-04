import { test, expect } from "@playwright/test";

const isSortedAsc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] <= +element);
const isSortedDesc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] >= +element);

test.describe("actions and assertions", () => {
  test("product catalog is properly sorted", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "Products" }).click();
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await page.getByRole("link", { name: "Price: Low to high" }).click();
    const productGrid = page.getByTestId("search-grid");
    const productLinks = productGrid.getByRole("link");
    await expect(productLinks).not.toHaveCount(0);

    await expect(async () => {
      const allPrices = await productLinks.getByTestId("price").allInnerTexts();
      expect(
        isSortedAsc(allPrices),
        "products are sorted with increasing price"
      ).toBeTruthy();
    }).toPass();

    await page.getByRole("link", { name: "Price: High to low" }).click();

    await expect(async () => {
      const allPrices = await productLinks.getByTestId("price").allInnerTexts();
      expect(
        isSortedDesc(allPrices),
        "products are sorted with decreasing price"
      ).toBeTruthy();
    }).toPass();
  });
});

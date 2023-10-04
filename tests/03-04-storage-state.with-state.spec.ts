import { test, expect } from "./03-03-setup";
import { authFile } from "./03-04-storage-state.setup";

const isSortedAsc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] <= +element);
const isSortedDesc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] >= +element);

test.use({ storageState: "./tests/03-04.auth.json" });

test("product catalog is properly sorted for a logged in user with storage state", async ({
  page,
}) => {
  await page.goto("/");
  // check that the user is logged in via storageState
  await expect(page.getByTestId("login-name")).toBeVisible();

  await page.getByRole("link", { name: "Products" }).click();
  await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  await page.getByRole("link", { name: "Price: Low to high" }).click();
  const productGrid = page.getByTestId("search-grid");
  const productLinks = productGrid.getByRole("link");
  await expect(productLinks).not.toHaveCount(0);

  await expect(async () => {
    const allPrices = await productLinks.getByTestId("price").allInnerTexts();
    expect(isSortedAsc(allPrices)).toBeTruthy();
  }).toPass();

  await page.getByRole("link", { name: "Price: High to low" }).click();

  await expect(async () => {
    const allPrices = await productLinks.getByTestId("price").allInnerTexts();
    expect(isSortedDesc(allPrices)).toBeTruthy();
  }).toPass();
});

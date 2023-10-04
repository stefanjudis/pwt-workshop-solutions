import { test, expect } from "./03-03-setup";

const isSortedAsc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] <= +element);
const isSortedDesc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] >= +element);

test("product catalog is properly sorted for a logged in user", async ({
  loggedInPage,
}) => {
  await loggedInPage.goto("/");

  await loggedInPage.getByRole("link", { name: "Products" }).click();
  await expect(
    loggedInPage.getByRole("heading", { name: "Products" })
  ).toBeVisible();
  await loggedInPage.getByRole("link", { name: "Price: Low to high" }).click();
  const productGrid = loggedInPage.getByTestId("search-grid");
  const productLinks = productGrid.getByRole("link");
  await expect(productLinks).not.toHaveCount(0);

  await expect(async () => {
    const allPrices = await productLinks.getByTestId("price").allInnerTexts();
    expect(isSortedAsc(allPrices)).toBeTruthy();
  }).toPass();

  await loggedInPage.getByRole("link", { name: "Price: High to low" }).click();

  await expect(async () => {
    const allPrices = await productLinks.getByTestId("price").allInnerTexts();
    expect(isSortedDesc(allPrices)).toBeTruthy();
  }).toPass();
});

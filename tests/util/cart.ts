import { expect } from "@playwright/test";

export const addProductToCartAndValidateCart = async (page) => {
  const productName = await page.getByRole("heading", { level: 1 }).innerText();
  await page.getByLabel("Add item to cart").click();

  await expect(
    page.getByTestId("cart").getByRole("heading", { name: productName })
  ).toBeVisible();
};

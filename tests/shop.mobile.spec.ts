import { test, expect } from "@playwright/test";
import { addProductToCartAndValidateCart } from "./util/cart";

test.describe("mobile shop", () => {
  test("add to cart and validate", async ({ page }) => {
    await page.goto("/");

    await test.step("add first product to cart and validate", async () => {
      await page
        .getByTestId("hero-product-grid")
        .getByRole("link", {
          name: "The Collection Snowboard: Liquid The Collection Snowboard: Liquid 749.95EUR",
        })
        .click();
      await expect(page.getByLabel("Add item to cart")).toBeVisible();
      await addProductToCartAndValidateCart(page);
    });

    await page.getByLabel("Close cart").click();

    await page
      .getByRole("link", {
        name: "PWT Workshop logo",
        exact: true,
      })
      .click();

    await test.step("add 2nd product to cart and validate", async () => {
      await page
        .getByTestId("hero-product-grid")
        .getByRole("link")
        .nth(1)
        .click();
      await expect(page.getByLabel("Add item to cart")).toBeVisible();
      await addProductToCartAndValidateCart(page);
    });

    const cart = page.getByTestId("cart");
    const prices = await cart.getByTestId("price").allInnerTexts();
    let sum = 0;

    for (let price of prices) {
      sum += +price;
    }

    const total = await cart.getByTestId("cart-total").innerText();
    expect(sum).toBe(parseFloat(total));
  });
});

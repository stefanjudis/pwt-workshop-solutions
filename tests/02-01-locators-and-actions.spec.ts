import { test, expect } from "@playwright/test";

test.describe("actions and assertions", () => {
  test("log into the shop", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByLabel("Your name").fill("stefan");
    await page.getByLabel("Your password").fill("12345678");
    await page.getByRole("button", { name: "Login" }).click();
    await page.getByTestId("login-name").click();
  });

  test("add the first and second home product to cart", async ({ page }) => {
    await page.goto("/");
    await test.step("add first product to cart", async () => {
      await page
        .getByTestId("hero-product-grid")
        .getByRole("link", {})
        .first()
        .click();
      await page.getByLabel("Add item to cart").click();
      await page.getByLabel("Close cart").click();
    });

    await test.step("add first product to cart", async () => {
      await page
        .getByRole("navigation")
        .getByRole("link", { name: "PWT Workshop logo PWT Workshop" })
        .click();
      await page.getByRole("link").nth(1).click();
      await page.getByLabel("Add item to cart").click();
      await page.getByLabel("Close cart").click();
    });
  });
});

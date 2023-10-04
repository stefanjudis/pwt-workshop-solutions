import { test } from "@playwright/test";

test.describe("learn how to record @ci", () => {
  test("recording: add two home products to cart", async ({ page }) => {
    await page.goto("/");
    await page
      .getByTestId("hero-product-grid")
      .getByRole("link", {
        name: "The Collection Snowboard: Liquid The Collection Snowboard: Liquid 749.95EUR",
      })
      .click();
    await page.getByLabel("Add item to cart").click();
    await page.getByLabel("Close cart").click();
    await page
      .getByRole("navigation")
      .getByRole("link", { name: "PWT Workshop logo PWT Workshop" })
      .click();
    await page
      .getByRole("link", {
        name: "The Multi-managed Snowboard The Multi-managed Snowboard 629.95EUR",
      })
      .click();
    await page.getByLabel("Add item to cart").click();
  });

  test("recording: search for 'hydrogen' and add one product to cart", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByPlaceholder("Search for products...").fill("hydrogen");
    await page.getByPlaceholder("Search for products...").press("Enter");
    await page
      .getByRole("link", {
        name: "The Collection Snowboard: Liquid The Collection Snowboard: Liquid 749.95",
      })
      .first()
      .click();
    await page.getByLabel("Add item to cart").click();
    await page.getByLabel("Close cart").click();
  });
});

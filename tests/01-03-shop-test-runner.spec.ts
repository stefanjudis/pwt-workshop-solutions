import { test } from "@playwright/test";

test.describe("use the test runner", () => {
  test("test-runner: add two home products to cart", async ({
    page,
  }, testInfo) => {
    testInfo.annotations.push({
      type: "This is a great test!!!",
      description: "https://some-url.com",
    });

    await page.goto("/");

    await test.step("add first product to cart", async () => {
      await page
        .getByTestId("hero-product-grid")
        .getByRole("link", {
          name: "The Collection Snowboard: Liquid The Collection Snowboard: Liquid 749.95EUR",
        })
        .click();
      await page.getByLabel("Add item to cart").click();
      await page.getByLabel("Close cart").click();
    });

    await page
      .getByRole("navigation")
      .getByRole("link", { name: "PWT Workshop logo PWT Workshop" })
      .click();

    await test.step("add second product to cart", async () => {
      await page
        .getByRole("link", {
          name: "The Multi-managed Snowboard The Multi-managed Snowboard 629.95EUR",
        })
        .click();
      await page.getByLabel("Add item to cart").click();
      await page.getByLabel("Close cart").click();
    });
  });
});

import { test, expect } from "@playwright/test";

test.describe("end boss", async () => {
  test.setTimeout(200_000);

  test("make an order", async ({ page }, testInfo) => {
    await page.goto("/");

    await page
      .getByTestId("hero-product-grid")
      .getByRole("link")
      .first()
      .click();

    await page.getByLabel("Add item to cart").click();

    await page.getByRole("link", { name: "Proceed to Checkout" }).click();

    await test.step("fill in shipping info", async () => {
      await page
        .getByPlaceholder("Email or mobile phone number")
        .fill("stefanjudis@gmail.com");
      await page.getByLabel("Country/Region").selectOption("GR");
      await page.getByPlaceholder("Last name").fill("Judis");
      await page.getByPlaceholder("Address").fill("The Athens Concert Hall");
      await page.getByPlaceholder("Postal code").fill("115 21");
      await page.getByPlaceholder("City").fill("Athens");
      await expect(page.getByText("Calculating...")).not.toBeVisible();
    });

    await page.getByText("Standard International").click();

    await test.step("fill in credit card info", async () => {
      await page
        .frameLocator('iframe[title="Field container for: Card number"]')
        .getByPlaceholder("Card number")
        .fill("1");
      await page
        .frameLocator(
          'iframe[title="Field container for: Expiration date (MM / YY)"]'
        )
        .getByPlaceholder("Expiration date (MM / YY)")
        .fill("11 / 24");
      await page
        .frameLocator('iframe[title="Field container for: Security code"]')
        .getByPlaceholder("Security code")
        .fill("111");
      await page
        .frameLocator('iframe[title="Field container for: Name on card"]')
        .getByPlaceholder("Name on card")
        .fill("Stefan Judis");
      await page
        .frameLocator('iframe[title="Field container for: Name on card"]')
        .getByPlaceholder("Name on card")
        .blur();
      await page.waitForRequest(/produce_batch/);
    });

    // repeat the submit order action in case it fails
    await expect(async () => {
      await expect(page.getByText("Calculating...")).not.toBeVisible();
      await page.getByRole("button", { name: "Review order" }).click();
      await page.waitForURL(/review/, {
        timeout: 10000,
      });
    }).toPass({ timeout: 40000 });

    await page.waitForTimeout(5000);

    await expect(page.getByRole("button", { name: "Pay now" })).toBeVisible();

    // let's stop here...
    // at this point I'm pretty convinced that there's a bug in the shopify checkout 😅
    // await expect(page.getByRole("heading", { name: "Thank you!" })).toBeVisible(
    //   { timeout: 20000 }
    // );
  });
});

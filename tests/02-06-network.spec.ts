import { test, expect } from "@playwright/test";

test.describe("network", async () => {
  test("mock the news API call", async ({ page }) => {
    await page.route("/api/news/", (route) =>
      route.fulfill({
        status: 200,
        body: JSON.stringify({ message: "I made it!" }),
      })
    );
    await page.goto("/", { waitUntil: "networkidle" });
    await page
      .getByTestId("newsbox")
      .screenshot({ path: "mocked-newsbox.png" });
  });

  test("block all shopify requests", async ({ page }) => {
    await page.route(/shopify/, (route) => route.abort());
    await page.goto("/");
    await page.getByRole("link", { name: "Products" }).click();
  });
});

import { test, expect } from "@playwright/test";

test.describe("screenshots", async () => {
  test("take screenshots and create visual regression tests", async ({
    page,
    browserName,
  }, testInfo) => {
    page.goto("/");
    const homeShot = await page.screenshot({ path: "./screenshots/home.png" });
    await page
      .getByRole("heading", { level: 1 })
      .screenshot({ path: "./screenshots/headline.png" });

    await page
      .getByRole("heading", { level: 1 })
      .screenshot({ path: `./screenshots/docs-${browserName}.png` });

    await expect(page).toHaveScreenshot("home.png", { fullPage: true });
    await expect(page).toHaveScreenshot("home-without-product.png", {
      fullPage: true,
      mask: [page.getByTestId("hero-product-grid")],
    });

    await testInfo.attach("screenshot", {
      body: homeShot,
      contentType: "image/png",
    });
  });
});

import { test, expect } from "@playwright/test";

test.describe("new tabs", async () => {
  test("capture new tabs", async ({ page }) => {
    await page.goto("/new-tabs/");
    const openLinks = page.locator("[target=_blank]");

    let counter = 0;
    for (let link of await openLinks.all()) {
      const [newPage] = await Promise.all([
        page.waitForEvent("popup"),
        link.click(),
      ]);

      await newPage.waitForLoadState();

      await newPage.screenshot({
        path: `./screenshots/${counter}.png`,
      });
      counter++;
    }
  });
});

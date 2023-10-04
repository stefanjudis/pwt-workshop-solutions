import { test, expect } from "@playwright/test";

test.describe("web perf metrics", async () => {
  test("add home product to cart 000", async ({ page }, testInfo) => {
    await page.goto("/");

    const largestContentfulPaint = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((l) => {
          const entries = l.getEntries();
          // the last entry is the largest contentful paint
          const largestPaintEntry = entries.at(-1);
          resolve(largestPaintEntry.startTime);
        }).observe({
          type: "largest-contentful-paint",
          buffered: true,
        });
      });
    });

    expect(+largestContentfulPaint).toBeLessThan(3000);

    testInfo.annotations.push({
      type: "LCP",
      description: largestContentfulPaint as string,
    });
  });
});

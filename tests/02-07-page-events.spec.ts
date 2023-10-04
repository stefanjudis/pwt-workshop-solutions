import { test, expect } from "@playwright/test";

test.describe("page events", async () => {
  test("fail on JS error or console.log", async ({ page }) => {
    const capturedLogs: Array<string> = [];

    page.on("console", (msg) => {
      capturedLogs.push(msg.text());
    });

    await page.goto("/?log=true", { waitUntil: "networkidle" });

    expect(capturedLogs).toHaveLength(0);
    if (capturedLogs.length) {
      console.log(capturedLogs);
    }
  });
});

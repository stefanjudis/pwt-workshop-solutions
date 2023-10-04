import { test, expect } from "@playwright/test";

test.describe("actions and assertions @ci", () => {
  test("log into the shop", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByLabel("Your name").fill("stefan");
    await page.getByLabel("Your password").fill("12345678");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByTestId("login-name")).toBeVisible();
  });
});

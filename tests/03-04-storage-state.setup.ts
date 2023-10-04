import { test as setup, expect } from "@playwright/test";

export const authFile = "./tests/03-04.auth.json";

setup("authenticate", async ({ page }, use) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByLabel("Your name").fill(process.env.name || "stefan");
  await page.getByLabel("Your password").fill(process.env.PW || "1234566343");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByTestId("login-name")).toBeVisible();

  await page.context().storageState({ path: authFile });
});

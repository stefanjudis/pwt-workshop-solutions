import { test as base, expect } from "@playwright/test";

export const test = base.extend({
  loggedInPage: async ({ page }, use) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Login" }).click();
    await page.getByLabel("Your name").fill(process.env.name || "stefan");
    await page.getByLabel("Your password").fill(process.env.PW || "1234566343");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByTestId("login-name")).toBeVisible();

    use(page);

    await page.getByRole("link", { name: "Logout" }).click();
    await expect(page.getByTestId("login-name")).not.toBeVisible();
  },
});

export { expect } from "@playwright/test";

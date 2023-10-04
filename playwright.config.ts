import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://pwt-workshop-store.vercel.app/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on",
  },

  /* Configure projects for major browsers */
  projects: [
    // projects for desktop, mobile and api
    // npx playwright test --project=desktop
    // npx playwright test --project=mobile
    // npx playwright test --project=api
    {
      name: "desktop",
      testIgnore: /(mobile|api).spec.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testMatch: "*.mobile.spec.ts",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "api",
      testMatch: "*.api.spec.ts",
    },

    // projects that leverage setup and storage state
    // npx playwright test --project=storageState
    {
      name: "setup",
      testMatch: "*.setup.ts",
    },
    {
      dependencies: ["setup"],
      name: "storageState",
      testMatch: "*.with-state.spec.ts",
    },
  ],
});

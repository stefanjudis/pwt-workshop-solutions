import { test, expect } from "./setup";
import { addProductToCartAndValidateCart } from "./util/cart";

const isSortedAsc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] <= +element);
const isSortedDesc = (arr) =>
  arr.every((element, index, array) => !index || +array[index - 1] >= +element);

test.describe("shop", () => {
  test("mock news on home", async ({ page }) => {
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

  test("fail on JS error or console.log", async ({ page }) => {
    const capturedLogs: Array<string> = [];

    page.on("console", (msg) => {
      capturedLogs.push(msg.text());
    });

    await page.goto("/", { waitUntil: "networkidle" });

    expect(capturedLogs).toHaveLength(0);
    if (capturedLogs.length) {
      console.log(capturedLogs);
    }
  });

  test("capture new tabs", async ({ page }) => {
    await page.goto("/new-tabs/");

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
        path: `./${counter}.png`,
      });
      counter++;
    }
  });

  test("take screenshots", async ({ page, browserName }, testInfo) => {
    page.goto("/");
    const homeShot = await page.screenshot({ path: "./home.png" });
    await page
      .getByRole("heading", { level: 1 })
      .screenshot({ path: "./headline.png" });

    await page
      .getByRole("heading", { level: 1 })
      .screenshot({ path: `./docs-${browserName}.png` });

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

  test("add products and validate cart", async ({ page }) => {
    await page.goto("/");

    await test.step("add first product to cart and validate", async () => {
      await page
        .getByTestId("hero-product-grid")
        .getByRole("link", {
          name: "The Collection Snowboard: Liquid The Collection Snowboard: Liquid 749.95EUR",
        })
        .click();
      await expect(page.getByLabel("Add item to cart")).toBeVisible();
      await addProductToCartAndValidateCart(page);
    });

    await page.getByLabel("Close cart").click();

    await page
      .getByRole("navigation")
      .getByRole("link", { name: "PWT Workshop logo PWT Workshop" })
      .click();

    await test.step("add 2nd product to cart and validate", async () => {
      await page
        .getByTestId("hero-product-grid")
        .getByRole("link")
        .nth(1)
        .click();
      await expect(page.getByLabel("Add item to cart")).toBeVisible();
      await addProductToCartAndValidateCart(page);
    });

    const cart = page.getByTestId("cart");
    const prices = await cart.getByTestId("price").allInnerTexts();
    let sum = 0;

    for (let price of prices) {
      sum += +price;
    }

    const total = await cart.getByTestId("cart-total").innerText();
    expect(sum).toBe(parseFloat(total));
  });

  test("search for hydrogen", async ({ page }, testInfo) => {
    await page.goto("https://pwt-workshop-store.vercel.app/");

    await test.step("Fill out search form", async () => {
      await page.getByPlaceholder("Search for products...").click();
      await page.getByPlaceholder("Search for products...").fill("hydrogen");
      await expect(async () => {
        await page.getByPlaceholder("Search for products...").press("Enter");
        await page.waitForURL(/search/);
      }).toPass();
    });

    await page
      .getByRole("link", {
        name: "The Collection Snowboard: Oxygen The Collection Snowboard: Oxygen 1025",
      })
      .click();

    testInfo.annotations.push({
      type: "Some thing is a 🐟y here",
      description: "https://some-url.com",
    });
  });

  test("product catalog is properly sorted", async ({ loggedInPage }) => {
    await loggedInPage.goto("/");

    await loggedInPage.getByRole("link", { name: "Products" }).click();
    await expect(
      loggedInPage.getByRole("heading", { name: "Products" })
    ).toBeVisible();
    await loggedInPage
      .getByRole("link", { name: "Price: Low to high" })
      .click();
    const productGrid = loggedInPage.getByTestId("search-grid");
    const productLinks = productGrid.getByRole("link");
    await expect(productLinks).not.toHaveCount(0);

    await expect(async () => {
      const allPrices = await productLinks.getByTestId("price").allInnerTexts();
      expect(isSortedAsc(allPrices)).toBeTruthy();
    }).toPass();

    await loggedInPage
      .getByRole("link", { name: "Price: High to low" })
      .click();

    await expect(async () => {
      const allPrices = await productLinks.getByTestId("price").allInnerTexts();
      expect(isSortedDesc(allPrices)).toBeTruthy();
    }).toPass();
  });

  test("add home product to cart", async ({ page }, testInfo) => {
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

    testInfo.annotations.push({
      type: "LCP",
      description: largestContentfulPaint as string,
    });

    await page
      .getByTestId("hero-product-grid")
      .getByRole("link")
      .first()
      .click();
    await page.getByLabel("Add item to cart").click();
    await expect(page.getByLabel("Add item to cart")).toBeDisabled();
    await page.getByRole("link", { name: "Proceed to Checkout" }).click();
    await page
      .getByPlaceholder("Email or mobile phone number")
      .fill("stefanjudis@gmail.com");
    await page.getByLabel("Country/Region").selectOption("GR");
    await page.getByPlaceholder("Last name").fill("Judis");
    await page.getByPlaceholder("Address").fill("The Athens Concert Hall");
    await page.getByPlaceholder("Postal code").fill("115 21");
    await page.getByPlaceholder("City").fill("Athens");
    await page.getByText("Standard International").click();
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
    await expect(async () => {
      await page.getByRole("button", { name: "Review order" }).click();
      await expect(
        page.getByRole("button", { name: "Review order" })
      ).toBeHidden();
    }).toPass();
    await page.getByRole("button", { name: "Pay now" }).click();
    await expect(page.getByRole("heading", { name: "Thank you!" })).toBeVisible(
      { timeout: 10000 }
    );
  });
});

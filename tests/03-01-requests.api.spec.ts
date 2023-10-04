import { test, expect } from "@playwright/test";

function validateProduct(product) {
  for (let variant of product.variants) {
    expect.soft(variant.price.amount).toBeDefined();
    expect.soft(variant.price.currencyCode).toBeDefined();
  }
}

test.describe("API testing", async () => {
  test("make requests", async ({ request }) => {
    const response = await request.get("/api/products/");
    expect(response).toBeOK();

    const products = await response.json();

    for (let product of products) {
      validateProduct(product);
    }
    expect(products.length).toBe(15);
  });
});

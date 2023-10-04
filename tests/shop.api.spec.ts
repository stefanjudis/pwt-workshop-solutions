import { test, expect } from "@playwright/test";

test("API testing", async ({ request }) => {
  const response = await request.get("/api/products/");
  expect(response).toBeOK();

  const products = await response.json();
  expect(products.length).toBe(15);
});

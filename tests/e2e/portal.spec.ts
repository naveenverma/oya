import { test, expect } from "@playwright/test";

test.describe("Public verification", () => {
  test("home page loads with verification form", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Secure Registry/i }),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Enter Control Number")).toBeVisible();
  });

  test("invalid control number shows not found", async ({ page }) => {
    await page.goto("/verify/INVALID-NOT-FOUND-999");
    await expect(page.getByText(/Record not found/i)).toBeVisible();
  });
});

test.describe("Admin access", () => {
  test("unauthenticated user is redirected from admin dashboard", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("Admin CRUD", () => {
  test.skip(
    !process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD,
    "Requires E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD",
  );

  test("admin login and create record flow", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(process.env.E2E_ADMIN_EMAIL!);
    await page.getByLabel("Password").fill(process.env.E2E_ADMIN_PASSWORD!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.goto("/admin/records/new");
    const controlNumber = `E2E-${Date.now()}`;
    await page.getByLabel("Control Number *").fill(controlNumber);
    await page.getByLabel("Record Name *").fill("E2E Test Record");
    await page.getByRole("button", { name: "Create Record" }).click();
    await expect(page).toHaveURL(/\/admin\/records\//);
  });
});

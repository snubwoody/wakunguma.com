import { test, expect } from "@playwright/test";

test("Default title", async({page}) => {
    await page.goto("http://localhost:4321");
    await expect(page).toHaveTitle("Wakunguma Kalimukwa");
});

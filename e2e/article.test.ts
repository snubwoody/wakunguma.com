import { test, expect } from "@playwright/test";

test("Page title", async({page}) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle("Browse articles");
});


test("",async({page}) => {
    await page.goto("/blog");
});

import { test, expect } from "@playwright/test";

test("Theme switcher", async ({ page }) => {
    await page.goto("http://localhost:4321");
    
    const response = await fetch("http://localhost:4321/api/theme",{
        method:"POST"
    });

    console.log(await response.text());
});

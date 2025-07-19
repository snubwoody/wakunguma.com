import { test, expect } from "@playwright/test";

test("Page title", async({page}) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle("Browse articles");
});


test("Latest post link works",async({page, baseURL}) => {
    await page.goto("/blog");
    const elements = await page
        .getByRole("list",{name: "Latest posts list"})
        .getByRole("link")
        .all();
    expect(elements.length).toBeGreaterThan(0);

    const url = await elements[0].getAttribute("href");
    await elements[0].click();
    expect(page.url()).toBe(`${baseURL}${url}`);
});



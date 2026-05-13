const page = await browser.getPage("main");
await page.goto("https://batdongsan.com.vn/nguoi-ban/dang-tin");
console.log(await page.title());

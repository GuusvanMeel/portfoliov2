// lighthouse-auth.js
const { loadEnvConfig } = require ("@next/env");

loadEnvConfig(process.cwd());
module.exports = async (browser) => {
  const page = await browser.newPage();

  const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  throw new Error("Missing =ADMIN_EMAIL or =ADMIN_PASSWORD");
  
  };
  await page.goto("http://localhost:3000/login", {
    waitUntil: "networkidle0"})
  await page.type('input[name="email"]', process.env.ADMIN_EMAIL);
  await page.type('input[name="password"]', process.env.ADMIN_PASSWORD);

  
 await page.click('button[type="submit"]');

await page.waitForFunction(
  () => !window.location.pathname.includes("/login"),
  { timeout: 60000 }
);

  await page.close();
};

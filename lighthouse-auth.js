// lighthouse-auth.js
// Signs in with the TEST admin account. Lighthouse runs against the test database only
// (locally from .env.test.local, in CI from secrets).
try {
  process.loadEnvFile(".env.test.local");
} catch {
  // No local file: CI provides the variables.
}

module.exports = async (browser) => {
  const page = await browser.newPage();

  const email = process.env.TEST_ADMIN_EMAIL;
  const password = process.env.TEST_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("Missing TEST_ADMIN_EMAIL or TEST_ADMIN_PASSWORD");
  }
  await page.goto("http://localhost:3000/login", {
    waitUntil: "networkidle0",
  });
  await page.type('input[name="email"]', email);
  await page.type('input[name="password"]', password);

  await page.click('button[type="submit"]');

  await page.waitForFunction(() => !window.location.pathname.includes("/login"), {
    timeout: 60000,
  });

  await page.close();
};

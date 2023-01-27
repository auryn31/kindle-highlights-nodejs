const puppeteer = require("puppeteer");
const fs = require("fs");

require("dotenv").config();

const wait = async (seconds) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    userDataDir: "./user_data",
  });
  const page = await browser.newPage();

  await page.goto("https://read.amazon.com/notebook");

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  // if login page is shown, login
  if ((await page.$("#ap_email")) !== null) {
    // Wait and click on first result
    await page.focus("#ap_email");
    await page.keyboard.type(process.env.USERNAME);

    await page.focus("#ap_password");
    await page.keyboard.type(process.env.PASSWORD);

    await new Promise((resolve) => setTimeout(resolve, 200));
    await page.focus("#signInSubmit");
    await page.click("#signInSubmit");
  }

  await page.waitForSelector(".kp-notebook-library-each-book");
  const notebooks = await page.$$(".kp-notebook-library-each-book");
  await wait(1);

  const highlights = [];
  console.log("Start reading highlights");

  for (const notebook of notebooks) {
    notebook.click();
    await wait(1);
    await page.waitForSelector("#highlight");
    const highlightElements = await page.$$("#highlight");
    const title = await page.$eval(
      "h3.kp-notebook-metadata",
      (el) => el.textContent
    );
    const author = await page.$eval(
      "p.kp-notebook-metadata:last-of-type",
      (el) => el.textContent
    );

    console.log(`Reading highlights`);
    console.log(`From author: ${author}`);
    console.log(`From book: ${title}`);

    for (const highlightElement of highlightElements) {
      const highlight = await page.evaluate(
        (el) => el.textContent,
        highlightElement
      );
      if (highlight) {
        highlights.push({ title, highlight, author });
      }
    }
    await wait(2);
  }

  console.log(`Write ${highlights.length} highlights to file`);
  fs.writeFileSync(
    "./highlights.json",
    JSON.stringify({ updated: new Date(), highlights })
  );

  await browser.close();
})();

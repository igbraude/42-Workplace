const { promises: fs } = require('fs');
const { join } = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const date = Date.now();
  let users = [];

  for (let i = 0; i <= 1250; i++) {
    try {
      console.log(`Scraping ${i}/1000`);

      await page.goto(`https://fr.fakenamegenerator.com/advanced.php?t=country&n%5B%5D=fr&c%5B%5D=fr&gen=50&age-min=18&age-max=25`);
      const userFirstPart = await page.evaluate(() => ({
        lat: document.getElementsByClassName('dl-horizontal')[2].getElementsByTagName("dd")[0].textContent.split(", ")[0],
        lng: document.getElementsByClassName('dl-horizontal')[2].getElementsByTagName("dd")[0].textContent.split(", ")[1],
        age: document.getElementsByClassName('dl-horizontal')[6].getElementsByTagName("dd")[0].textContent.split(" ")[0],
        gender: Math.floor(Math.random()*100) === 86 ? "bisexual" : (Math.floor(Math.random()*2) === 0 ? "female" : "male"),
        sexualOrientation: Math.floor(Math.random()*50) === 45 ? "bisexual" : (Math.floor(Math.random()*2) === 0 ? "female" : "male"),
        email: document.getElementsByClassName('dl-horizontal')[8].getElementsByTagName("dd")[0].textContent.split(" ")[0],
        password: "Qwerty123",
      }));

      await page.goto(`https://www.fakeaddressgenerator.com/World_more1/get_ko_address`);
      const userSecondPart = await page.evaluate(() => ({
        firstName: document.getElementsByClassName('row item')[1].getElementsByClassName('no-style')[0].value,
        lastName: document.getElementsByClassName('row item')[2].getElementsByClassName('no-style')[0].value,
        username: document.getElementsByClassName('row item')[21].getElementsByClassName('no-style')[0].value,
      }));

      await page.goto(`https://www.twitterbiogenerator.com/`);
      const userThirdPart = await page.evaluate(() => ({
        bio: document.getElementById('bio').value
      }));

      const user = Object.assign(userFirstPart, userSecondPart, userThirdPart);

      users = [...users, user];
      await fs.writeFile(join(__dirname, `..`,`data/`,`users-${date}.json`), JSON.stringify(users), 'utf8');

    } catch (e) {
      console.error(e);
    }
  }
  console.log('Scrap Ended');

  await browser.close();
})().catch(console.error);
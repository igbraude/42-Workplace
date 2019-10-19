const { promises: fs } = require('fs');
const { join } = require('path');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const date = Date.now();
    let userPPList = [];

    for (let i = 0; i <= 500; i++) {
        try {
            console.log(`Scraping ${i}/500`);

            // await page.goto(`https://weheartit.com/prop_place/collections/99016180-random-asian-girls?page=${i}`);
            await page.goto(`https://weheartit.com/ally_se/collections/104910750-random-asian?page=${i}`);
            const userPP = await page.evaluate(() => ({
                // picture: document.getElementsByTagName('img')[4].src
                pictures: [...document.getElementsByClassName('entry-thumbnail')]
                    .map((item) =>
                        item.src
                    )
            }));

            userPPList = userPPList.concat(userPP.pictures);
            // await fs.writeFile(join(__dirname, `..`,`data/`,`female-pictures-${date}.json`), JSON.stringify(userPPList), 'utf8');
            await fs.writeFile(join(__dirname, `..`,`data/`,`male-pictures-${date}.json`), JSON.stringify(userPPList), 'utf8');

        } catch (e) {
            console.error(e);
        }
    }
    console.log('Scrap Ended');

    await browser.close();
})().catch(console.error);
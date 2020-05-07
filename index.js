const puppeteer = require('puppeteer');
const baseConferenceUrl = 'https://www.churchofjesuschrist.org/general-conference?lang=eng';

async function getTalkSources(talkUrl) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(talkUrl);

  const talkSources = await page.evaluate(() => {
    return [];
  });

  await browser.close();
  return talkSources;
}

async function getAllConferenceTalkData() {
  const talkUrl = 'https://www.churchofjesuschrist.org/study/general-conference/2020/04/16holmes?lang=eng';
  const talkSources = await getTalkSources(talkUrl);
  return talkSources;
}

getAllConferenceTalkData().then((talkSources) => {
  console.log(talkSources);
});

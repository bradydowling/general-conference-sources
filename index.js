const puppeteer = require('puppeteer');
const baseConferenceUrl = 'https://www.churchofjesuschrist.org/general-conference?lang=eng';

function parseTalkSources(talkData) {
  return [];
}

async function getTalkData(talkUrl) {
  const talkBaseUrl = 'https://www.churchofjesuschrist.org/study/';
  const talkDataPath = talkUrl.split(talkBaseUrl);
  const talkDataUrlBase = 'https://www.churchofjesuschrist.org/study/api/v3/language-pages/type/content?lang=eng&uri=';
  const talkDataUrl = `${talkDataUrlBase}${talkDataPath}`;
  fetch(talkDataUrl)
    .then(response => {
      return response.json();
    });
}

async function getAllConferenceTalkSources(baseConferenceUrl) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(baseConferenceUrl);

  const talkUrls = await page.evaluate(() => {
    return [];
  });

  const talkSources = await talkUrls.map(getTalkData);

  await browser.close();
  return talkSources;
}

getAllConferenceTalkSources(baseConferenceUrl).then((talkSources) => {
  console.log(talkSources);
});

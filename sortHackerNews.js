const { chromium } = require('playwright');

const sortHackerNewsArticles = async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://news.ycombinator.com/newest');
  let allArticles = [];

  for (let i = 0; i < 4; i++) {
    await page.waitForSelector('tr.athing');
    await page.waitForSelector('a.morelink', { timeout: 2000 });

    const articles = await page.$$eval('tr.athing', rows =>
      rows.map(row => {
        const rank = row.querySelector('.rank')?.innerText.trim() || '';
        const title = row.querySelector('.titleline > a')?.innerText.trim() || '';
        const timestamp = row.nextElementSibling?.querySelector('.age')?.title || '';
        return { rank, title, timestamp };
      })
    );

    allArticles = [...allArticles, ...articles];
    await page.click('a.morelink');
    await page.waitForTimeout(1000);
  }

  const limitedArticles = allArticles.slice(0, 100);
  let isRankedCorrectly = true;
  let results = '';

  for (let i = 0; i < limitedArticles.length - 1; i++) {
    const current = limitedArticles[i];
    const next = limitedArticles[i + 1];
    const currentTime = new Date(current.timestamp);
    const nextTime = new Date(next.timestamp);

    if (currentTime < nextTime) {
      results += `Ranked incorrectly between rank ${current.rank} and ${next.rank}<br>`;
      isRankedCorrectly = false;
    }
  }

  results += isRankedCorrectly ? 'Ranked correctly' : 'Ranking issues found';
  await browser.close();
  return { results, limitedArticles };
};

module.exports = { sortHackerNewsArticles };

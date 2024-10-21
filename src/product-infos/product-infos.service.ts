import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ProductInfosService {
  async getRankedCoupangProductInfos(keyword: string) {
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
    );
    await page.goto(`https://www.coupang.com/`);

    // 검색어 입력
    const searchInputSelector = 'input[name="q"]';
    await page.waitForSelector(searchInputSelector);
    await page.type(searchInputSelector, keyword);

    // 검색버튼 클릭
    const searchButtonSelector = 'a[class="search"]';
    await page.waitForSelector(searchButtonSelector);
    await page.click(searchButtonSelector);

    const productInfos = [];

    for (let i = 1; i <= 5; i += 1) {
      // 랭킹상품으로 이동
      const rankedProductSelector = `a:has(span.number.no-${i})`;
      await page.waitForSelector(rankedProductSelector);
      const href = await page.$eval(rankedProductSelector, (e) =>
        e.getAttribute('href'),
      );
      await page.goto('https://www.coupang.com/' + href);

      // 랭킹상품 정보 가져오기
      const title = await page.$eval(
        'h1.prod-buy-header__title',
        (h1) => h1.innerText,
      );
      const originPrice = await page.$eval(
        'span.origin-price',
        (span) => span.innerText,
      );
      const totalPrice = await page.$eval(
        'span.total-price',
        (span) => span.innerText,
      );
      const discountRate = await page.$eval(
        'span.discount-rate',
        (span) => span.innerText,
      );
      const reviewCount = await page.$eval(
        'span.count',
        (span) => span.innerText,
      );

      await new Promise((res) => {
        return setTimeout(() => {
          res(
            page.evaluate(() => {
              window.scrollTo(0, document.body.scrollHeight);
            }),
          );
        }, 1000);
      });

      const reviewButtonSelector = 'li[name="review"]';
      await page.waitForSelector(reviewButtonSelector);
      await page.click(reviewButtonSelector);

      const reviewSelector =
        'div.sdp-review__article__list__review__content.js_reviewArticleContent'; // 셀렉터 수정
      await page.waitForSelector(reviewSelector);

      const reviews = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll(
            'div.sdp-review__article__list__review__content.js_reviewArticleContent',
          ),
        ).map((div) =>
          div.innerHTML
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/<br>/g, '')
            .trim(),
        );
      });

      console.log(reviews);

      productInfos.push({
        title,
        originPrice,
        totalPrice,
        discountRate,
        reviewCount,
        reviews,
      });

      await page.goBack();
    }

    console.log(productInfos);

    await page.close();
  }

  async getRankedAliProductInfos(keyword: string) {}
}

import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { ScreenshotsService } from 'src/screenshots/screenshots.service';

@Injectable()
export class ProductInfosService {
  constructor(private readonly screenshotsService: ScreenshotsService) {}

  // puppeteer 브라우저 설정
  private async setupBrowser() {
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

    return { browser, page };
  }

  // innerText 가져오기
  private async getInnerText(page: puppeteer.Page, selector: string) {
    const innerText = await page.$eval(
      selector,
      (element) => element.innerHTML,
    );
    return innerText;
  }

  // href 값 가져오기
  private async getHref(page: puppeteer.Page, selector: string) {
    const href = await page.$eval(selector, (element) =>
      element.getAttribute('href'),
    );
    return href;
  }

  // input 핸들러
  private async handleInputSelector(
    page: puppeteer.Page,
    selector: string,
    keyword: string,
  ) {
    await page.waitForSelector(selector);
    await page.type(selector, keyword);
  }

  // click 핸들러
  private async handleClickSelector(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    await page.click(selector);
  }

  // coupang 검색어 입력
  private async searchCoupangProduct(page: puppeteer.Page, keyword: string) {
    await this.handleInputSelector(page, 'input.coupang-search', keyword);
    await this.handleClickSelector(page, 'a.search');
  }

  // coupang 상품 상세 정보 추출
  private async getCoupangProductDetails(page: puppeteer.Page) {
    const title = await this.getInnerText(page, 'h1.prod-buy-header__title');
    const originPrice = await this.getInnerText(page, 'span.origin-price');
    const totalPrice = await this.getInnerText(page, 'span.total-price');
    const discountRate = await this.getInnerText(page, 'span.discount-rate');
    const reviewCount = await this.getInnerText(page, 'span.count');

    return { title, originPrice, totalPrice, discountRate, reviewCount };
  }

  // coupang 상품 리뷰 추출
  private async getCoupangProductReviews(page: puppeteer.Page) {
    await this.handleClickSelector(page, 'li[name="review"]');

    const reviews = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          'div.sdp-review__article__list__review__content.js_reviewArticleContent',
        ),
      ).map((div) =>
        div.innerHTML
          .replace(/\n/g, ' ')
          .replace(/\s+/g, ' ')
          .replace(/<br>/g, '')
          .trim(),
      ),
    );

    return reviews;
  }

  // coupang 순위별 상품 주소정보 추출
  async getRankedProductHrefs(page: puppeteer.Page) {}

  // coupang 상품 정보 추출
  async getRankedCoupangProductInfos(keyword: string) {
    const { browser, page } = await this.setupBrowser();

    await page.goto('https://www.coupang.com/');

    await this.searchCoupangProduct(page, keyword);

    const productInfos = [];

    for (let i = 1; i <= 5; i += 1) {
      const productDetails = await this.getCoupangProductDetails(page);
      const productRevies = await this.getCoupangProductReviews(page);
    }
  }

  async getRankedAliProductInfos(keyword: string) {}
}

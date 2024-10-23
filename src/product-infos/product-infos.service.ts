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

  // 페이지 scroll 내리기
  private scrollPage(page: puppeteer.Page) {
    page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  // timeout 기다린 후 함수 실행
  private async waitFuncForTimeout(callback: Function, delay: number) {
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve(callback());
      }, delay),
    );
  }

  // innerText 가져오기
  private async getInnerText(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    const innerText = await page.$eval(
      selector,
      (element) => (element as HTMLElement).innerText,
    );
    return innerText;
  }

  // innerText 배열로 가져오기
  private async getInnerTextArray(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    const innerTextArray = await page.evaluate(
      (selector) =>
        Array.from(document.querySelectorAll(selector)).map(
          (div) => (div as HTMLElement).innerText,
        ),
      selector,
    );
    return innerTextArray;
  }

  // href 값 가져오기
  private async getHref(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
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

  // coupang 검색
  private async searchCoupangProduct(page: puppeteer.Page, keyword: string) {
    await this.handleInputSelector(page, 'input.coupang-search', keyword);
    await this.handleClickSelector(page, 'a.search');
  }

  // ali 검색
  private async searchAliProduct(page: puppeteer.Page, keyword: string) {
    await this.handleInputSelector(
      page,
      'input.search--keyword--15P08Ji',
      keyword,
    );
    await this.handleClickSelector(page, 'input.search--submit--2VTbd-T');
  }

  // ali href 추출
  private async getAliProductHrefs(page: puppeteer.Page) {
    await page.waitForSelector(
      'a.multi--container--1UZxxHY.cards--card--3PJxwBm.search-card-item',
    );
    const productHrefs = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(
          'a.multi--container--1UZxxHY.cards--card--3PJxwBm.search-card-item',
        ),
      ).map((card) => (card as HTMLAnchorElement).getAttribute('href'));
    });
    return productHrefs;
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

  // ali 상품 상세 정보 추출
  private async getAliProductDetails(page: puppeteer.Page) {
    const title = await this.getInnerText(page, 'div.title--wrap--UUHae_g');
    const originPrice = await this.getInnerText(
      page,
      'span.price--originalText--gxVO5_d',
    );
    const totalPrice = await this.getInnerText(
      page,
      'span.price--currentPriceText--V8_y_b5',
    );
    const discountRate = await this.getInnerText(
      page,
      'span.price--discount--Y9uG2LK',
    );
    const salesCount = await this.getInnerText(
      page,
      'span.reviewer--sold--ytPeoEy',
    );
    return {
      title,
      originPrice: originPrice + '원',
      totalPrice: totalPrice + '원',
      discountRate,
      salesCount,
    };
  }

  // coupang 상품 리뷰 추출
  private async getCoupangProductReviews(page: puppeteer.Page) {
    await this.waitFuncForTimeout(() => this.scrollPage(page), 1000);
    await this.handleClickSelector(page, 'li[name="review"]');
    const reviews = await this.getInnerTextArray(
      page,
      'div.sdp-review__article__list__review__content.js_reviewArticleContent',
    );
    return (reviews as Array<string>).map((review) =>
      review.replace(/\n/g, ' '),
    );
  }

  // ali 상품 리뷰 추출
  private async getAliProductReviews(page: puppeteer.Page) {
    await this.waitFuncForTimeout(() => this.scrollPage(page), 1000);
    const reviews = await this.getInnerTextArray(
      page,
      'div.list--itemReview--xQUhO78',
    );
    return (reviews as Array<string>).map((review) =>
      review.replace(/\n/g, ' '),
    );
  }

  // coupang 상품 정보 추출
  async getRankedCoupangProductInfos(keyword: string) {
    const { browser, page } = await this.setupBrowser();
    await page.goto('https://www.coupang.com/');
    await this.searchCoupangProduct(page, keyword);
    const productInfos = [];

    for (let rank = 1; rank <= 5; rank += 1) {
      const productHref = await this.getHref(
        page,
        `a:has(span.number.no-${rank})`,
      );
      await page.goto('https://www.coupang.com/' + productHref);
      const productDetails = await this.getCoupangProductDetails(page);
      const productReviews = await this.getCoupangProductReviews(page);
      productInfos.push({ ...productDetails, reviews: productReviews });
      await this.screenshotsService.captureRankedProductThumbnail(
        page,
        productDetails.title,
      );
      await page.goBack();
    }

    await browser.close();
    return productInfos;
  }

  // ali 상품 정보 추출
  async getRankedAliProductInfos(keyword: string) {
    const { browser, page } = await this.setupBrowser();
    await page.goto('https://ko.aliexpress.com/');
    await this.searchAliProduct(page, keyword);
    const productHrefs = await this.getAliProductHrefs(page);
    const productInfos = [];

    for (const productHref of productHrefs) {
      await page.goto('https:' + productHref);
      const productDetails = await this.getAliProductDetails(page);
      const productReviews = await this.getAliProductReviews(page);
      productInfos.push({ ...productDetails, reviews: productReviews });
      await this.screenshotsService.captureAliProductThumbnail(
        page,
        productDetails.title,
      );
      await page.goBack();
    }

    await browser.close();
    return productInfos;
  }
}

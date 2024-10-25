import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import * as puppeteer from 'puppeteer';
import { PuppeteerEngineService } from 'src/puppeteer-engine/puppeteer-engine.service';

@Injectable()
export class CoupangPartnersService {
  constructor(
    private readonly puppeteerEngineService: PuppeteerEngineService,
  ) {}
  // coupang 주소
  private readonly coupangUrl = 'https://www.coupang.com/';

  // coupang 검색
  private async searchCoupangProduct(page: puppeteer.Page, keyword: string) {
    await this.puppeteerEngineService.handleInputSelector(
      page,
      'input.coupang-search',
      keyword,
    );
    await this.puppeteerEngineService.handleClickSelector(page, 'a.search');
  }

  // coupang 상품 href 추출
  private async getCoupangProductHref(page: puppeteer.Page, rank: number) {
    const href = await this.puppeteerEngineService.getHref(
      page,
      `a:has(span.number.no-${rank})`,
    );
    return href;
  }

  // coupang 상품 상세 정보 추출
  private async getCoupangProductDetails(page: puppeteer.Page) {
    const title = await this.puppeteerEngineService.getInnerText(
      page,
      'h1.prod-buy-header__title',
    );
    const originPrice = await this.puppeteerEngineService.getInnerText(
      page,
      'span.origin-price',
    );
    const totalPrice = await this.puppeteerEngineService.getInnerText(
      page,
      'span.total-price',
    );
    const discountRate = await this.puppeteerEngineService.getInnerText(
      page,
      'span.discount-rate',
    );
    const reviewCount = await this.puppeteerEngineService.getInnerText(
      page,
      'span.count',
    );
    return { title, originPrice, totalPrice, discountRate, reviewCount };
  }

  // coupang 상품 리뷰 추출
  private async getCoupangProductReviews(page: puppeteer.Page) {
    await this.puppeteerEngineService.waitFuncForTimeout(
      () => this.puppeteerEngineService.scrollPage(page),
      1000,
    );
    await this.puppeteerEngineService.handleClickSelector(
      page,
      'li[name="review"]',
    );
    const reviews = await this.puppeteerEngineService.getInnerTextArray(
      page,
      'div.sdp-review__article__list__review__content.js_reviewArticleContent',
    );
    return (reviews as Array<string>).map((review) =>
      review.replace(/\n/g, ' '),
    );
  }

  // coupang 상품 썸네일 캡쳐
  private async captureCoupangProduct(
    page: puppeteer.Page,
    productName: string,
  ) {
    await this.puppeteerEngineService.handleCaptureSelector(
      page,
      '.prod-image__detail',
      productName,
    );
  }

  // coupang 상품 정보 추출
  async getRankedCoupangProductInfos(keyword: string) {
    const { browser, page } = await this.puppeteerEngineService.setupBrowser();
    await page.goto(this.coupangUrl);
    await this.searchCoupangProduct(page, keyword);
    const productInfos = [];

    for (let rank = 1; rank <= 5; rank += 1) {
      const productHref = await this.getCoupangProductHref(page, rank);
      await page.goto(this.coupangUrl + productHref);
      const productDetails = await this.getCoupangProductDetails(page);
      const productReviews = await this.getCoupangProductReviews(page);
      productInfos.push({ ...productDetails, reviews: productReviews });
      await this.captureCoupangProduct(page, productDetails.title);
      await page.goBack();
    }

    await browser.close();
    return productInfos;
  }
}

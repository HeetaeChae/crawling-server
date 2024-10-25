import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { PuppeteerEngineService } from 'src/puppeteer-engine/puppeteer-engine.service';

@Injectable()
export class AliAffiliateService {
  constructor(private puppeteerEngineService: PuppeteerEngineService) {}

  // ali 주소
  private readonly aliUrl = 'https://ko.aliexpress.com/';

  // ali 검색
  private async searchAliProduct(page: puppeteer.Page, keyword: string) {
    await this.puppeteerEngineService.handleInputSelector(
      page,
      'input.search--keyword--15P08Ji',
      keyword,
    );
    await this.puppeteerEngineService.handleClickSelector(
      page,
      'input.search--submit--2VTbd-T',
    );
  }

  // ali href 배열 추출
  private async getAliProductHrefs(page: puppeteer.Page) {
    const hrefs = await this.puppeteerEngineService.getHrefArray(
      page,
      'a.multi--container--1UZxxHY.cards--card--3PJxwBm.search-card-item',
    );
    return hrefs;
  }

  // ali 상품 상세 정보 추출
  private async getAliProductDetails(page: puppeteer.Page) {
    const title = await this.puppeteerEngineService.getInnerText(
      page,
      'div.title--wrap--UUHae_g',
    );
    const originPrice = await this.puppeteerEngineService.getInnerText(
      page,
      'span.price--originalText--gxVO5_d',
    );
    const totalPrice = await this.puppeteerEngineService.getInnerText(
      page,
      'span.price--currentPriceText--V8_y_b5',
    );
    const discountRate = await this.puppeteerEngineService.getInnerText(
      page,
      'span.price--discount--Y9uG2LK',
    );
    const salesCount = await this.puppeteerEngineService.getInnerText(
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

  // ali 상품 리뷰 추출
  private async getAliProductReviews(page: puppeteer.Page) {
    await this.puppeteerEngineService.waitFuncForTimeout(
      () => this.puppeteerEngineService.scrollPage(page),
      1000,
    );
    const reviews = await this.puppeteerEngineService.getInnerTextArray(
      page,
      'div.list--itemReview--xQUhO78',
    );
    return (reviews as Array<string>).map((review) =>
      review.replace(/\n/g, ' '),
    );
  }

  // ali 상품 썸네일 캡쳐
  private async captureAliProduct(page: puppeteer.Page, productName: string) {
    /*
    // 좌측 썸네일 show 트리거 가져오기
    const triggers = await this.puppeteerEngineService.getElementArray(
      page,
      '.slider--img--K0YbWW2',
    );
    console.log('triggers: ', triggers);
    for (const trigger of triggers) {
      console.log('trigger: ', trigger);

      await trigger.hover();
      const element = await this.puppeteerEngineService.getElement(
        page,
        '.magnifier--behiver--Wxq3D7r',
      );
      console.log('element', element);
      if (element) {
        // 썸네일 캡쳐
        await this.puppeteerEngineService.handleCaptureSelector(
          page,
          '.magnifier--behiver--Wxq3D7r',
          productName,
        );
        break;
      }
    }
    */
    let isCaptured = false;
    while (!isCaptured) {
      console.log(isCaptured, '여기 왜 안불림?');
      const isExistImage = await this.puppeteerEngineService.isExistElement(
        page,
        'div.magnifier--behiver--Wxq3D7r',
      );
      console.log(isExistImage);
      if (isExistImage) {
        await this.puppeteerEngineService.handleCaptureSelector(
          page,
          'div.magnifier--behiver--Wxq3D7r',
          productName,
        );
        isCaptured = true;
      } else {
        const videoElement = await this.puppeteerEngineService.getElement(
          page,
          'video.video--video--lsI7y97',
        );
        console.log(videoElement);
        await videoElement.hover();
        await this.puppeteerEngineService.handleClickSelector(
          page,
          'div.image-view--next--uMbeqsc',
        );
      }
    }
  }

  // ali 상품 정보 추출
  async getAliProductInfos(keyword: string) {
    const { browser, page } = await this.puppeteerEngineService.setupBrowser();
    await page.goto(this.aliUrl);
    await this.searchAliProduct(page, keyword);
    const productHrefs = await this.getAliProductHrefs(page);
    const productInfos = [];

    for (const productHref of productHrefs) {
      await page.goto('https:' + productHref);

      // 상품 이미지 관련
      // await page.hover('slider--item--FefNjlj');

      const productDetails = await this.getAliProductDetails(page);
      const productReviews = await this.getAliProductReviews(page);
      productInfos.push({ ...productDetails, reviews: productReviews });
      await this.captureAliProduct(page, productDetails.title);
      await page.goBack();
    }

    await browser.close();
    return productInfos;
  }
}

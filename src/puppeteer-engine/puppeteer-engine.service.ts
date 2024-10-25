import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerEngineService {
  // puppeteer 브라우저 설정
  async setupBrowser() {
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
  scrollPage(page: puppeteer.Page) {
    page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  // timeout 기다린 후 함수 실행
  async waitFuncForTimeout(callback: Function, delay: number) {
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve(callback());
      }, delay),
    );
  }

  // element 존재 여부
  async isExistElement(page: puppeteer.Page, selector: string) {
    const element = await page.$(selector);
    return !!element;
  }

  // element 가져오기
  async getElement(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    return element;
  }

  // element 배열로 가져오기
  async getElementArray(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    const elementArray = await page.$$(selector);
    return elementArray;
  }

  // innerText 가져오기
  async getInnerText(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    const innerText = await page.$eval(
      selector,
      (element) => (element as HTMLElement).innerText,
    );
    return innerText;
  }

  // innerText 배열로 가져오기
  async getInnerTextArray(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    const innerTextArray = await page.evaluate(
      (selector) =>
        Array.from(document.querySelectorAll(selector)).map(
          (element) => (element as HTMLElement).innerText,
        ),
      selector,
    );
    return innerTextArray;
  }

  // href 값 가져오기
  async getHref(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    const href = await page.$eval(selector, (element) =>
      element.getAttribute('href'),
    );
    return href;
  }

  async getHrefArray(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    const hrefArray = await page.evaluate(
      (selector) =>
        Array.from(document.querySelectorAll(selector)).map((element) =>
          (element as HTMLAnchorElement).getAttribute('href'),
        ),
      selector,
    );
    return hrefArray;
  }

  // input 핸들러
  async handleInputSelector(
    page: puppeteer.Page,
    selector: string,
    keyword: string,
  ) {
    await page.waitForSelector(selector);
    await page.type(selector, keyword);
  }

  // click 핸들러
  async handleClickSelector(page: puppeteer.Page, selector: string) {
    await page.waitForSelector(selector);
    await page.click(selector);
  }

  // capture 핸들러
  async handleCaptureSelector(
    page: puppeteer.Page,
    selector: string,
    productName: string,
  ) {
    const screenshotPath = resolve('assets', `${productName}.png`);
    await page.waitForSelector(selector);
    const element = await page.$(selector);
    const screenshot = await element.screenshot({ path: screenshotPath });
    return screenshot;
  }
}

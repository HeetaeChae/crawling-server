import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScreenshotsService {
  async captureVideo(videoUrl: string, count: number) {
    // 브라우저 열기
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
    });
    const page = await browser.newPage();

    // 비디오 웹페이지 url로 이동
    await page.goto(videoUrl);

    // 비디오 간격
    const videoDuration = await page.$eval('video', (el) => el.duration);
    const interval = videoDuration / count;

    // 비디오 플레이
    await page.evaluate(() => {
      document.querySelector('video')?.play();
    });

    // 비디오 전체화면으로 전환
    await page.evaluate(() => {
      document.querySelector('video')?.requestFullscreen();
    });

    for (let i = 0; i < 5; i += 1) {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(page.screenshot({ path: 'screenshot.png' }));
        }, 1000);
      });
    }

    /*
    // 비디오 스크린샷
    await page.screenshot({ path: 'screenshot.png' });
    */

    /*
    const screenshots: string[] = [];
    const screenshotsPath = `screenshot.png`;
    await page.screenshot({ path: screenshotsPath });
    */

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(browser.close());
      }, 1000 * 10);
    });
  }
}

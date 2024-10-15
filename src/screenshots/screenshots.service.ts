import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { unlink } from 'fs';
import { join, resolve } from 'path';
import * as puppeteer from 'puppeteer';

@Injectable()
export class ScreenshotsService {
  // 프로젝트 루트 디렉토리의 screenshot 폴더 경로 설정
  private readonly screenshotDir = resolve('assets');

  // 비디오 캡쳐하기
  async captureYoutubeVideo(url: string, count: number, title: string) {
    // 브라우저 열기
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    // 페이지 생성
    const page = await browser.newPage();

    // 비디오 웹페이지 url로 이동 및 열릴 때 까지 기다림
    await page.goto(url, { waitUntil: 'networkidle0' });

    // 비디오 스크린샷 뷰포트 세팅
    await page.setViewport({ width: 1280, height: 720 });

    // 비디오 간격
    const videoDuration = await page.$eval('video', (el) => el.duration);
    const interval = videoDuration / count;

    // 비디오 전체화면으로 전환
    await page.evaluate(() => {
      document.querySelector('video')?.requestFullscreen();
    });

    // 비디오 플레이
    await page.evaluate(() => {
      document.querySelector('video')?.play();
    });

    // 스크린샷 캡쳐
    for (let i = 1; i <= count; i += 1) {
      const delay = i === 1 ? 0 : interval * 1000;
      await new Promise((res) => {
        // 스크린샷 경로 지정
        const screenshotPath = resolve(this.screenshotDir, `${title}_${i}.png`);
        return setTimeout(() => {
          res(page.screenshot({ path: screenshotPath }));
        }, delay);
      });
    }

    await browser.close();
  }

  // 이미지 가져오기
  async getScreenshot(screenshotName: string) {
    const screenshotPath = join(process.cwd(), 'assets', screenshotName);
    return screenshotPath;
  }

  // 이미지 삭제하기
  async deleteScreenshot(screenshotName: string) {
    const screenshotPath = await this.getScreenshot(screenshotName);
    unlink(screenshotPath, (err) => {
      if (err) {
        throw new InternalServerErrorException('이미지 삭제 실패');
      } else {
        return `이미지 (${screenshotName}) 삭제 성공`;
      }
    });
  }
}

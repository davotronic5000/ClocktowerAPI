import * as puppeteer from 'puppeteer';

export default class PDFFunctions {
    public async getPdf() {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://google.com');
        await page.pdf({ path: 'temp/google.pdf' });
        await browser.close();
    }
}

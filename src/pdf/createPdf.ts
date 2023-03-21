import * as puppeteer from 'puppeteer';

export default class PDFFunctions {
    public async createPdf(): Promise<Buffer> {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://google.com');
        const pdf = await page.pdf();
        await browser.close();

        return pdf;
    }
}

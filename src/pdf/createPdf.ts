import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';
import fs from 'fs';

export default class PDFFunctions {
    public async createPdf(): Promise<Buffer> {
        const templateString = fs.readFileSync('src/pdf/template/script.handlebars').toString('utf-8')
        const template = handlebars.compile(templateString);


        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(template({helloWorld: "Hello World"}));
        const pdf = await page.pdf();
        await browser.close();

        return pdf;
    }
}

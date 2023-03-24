import * as puppeteer from 'puppeteer';
import { randomUUID } from 'crypto';
import * as handlebars from 'handlebars';
import fs from 'fs';
import { cwd } from 'process';
import { GetPdfRequest } from '../controllers/types';

export default class PDFFunctions {
    public async createPdf(model: GetPdfRequest): Promise<Buffer> {
        const templateString = fs
            .readFileSync('src/pdf/template/script.hbs')
            .toString('utf-8');
        const template = handlebars.compile(templateString);
        const tempPath = `./temp/test`;
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath);
        }
        const templatePath = tempPath + '/template.html';
        fs.writeFile(templatePath, template(model), (err) => console.log(err));
        //Setting headless to true will stop a browser popping up, false is useful for development
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('file:///' + cwd() + templatePath, {
            waitUntil: 'networkidle0',
        });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        //comment out the below line to stop the browser closing for development
        //await browser.close();

        return pdf;
    }
}

import * as puppeteer from 'puppeteer';
import { randomUUID } from 'crypto';
import * as handlebars from 'handlebars';
import fs from 'fs';
import { cwd } from 'process';

export default class PDFFunctions {
    public async createPdf(): Promise<Buffer> {
        handlebars.registerHelper(
            'splitString',
            (inputString: string, seperator: string): string[] => {
                return inputString.split(seperator);
            },
        );
        const templateString = fs
            .readFileSync('src/pdf/template/script.hbs')
            .toString('utf-8');
        const template = handlebars.compile(templateString);
        const tempPath = `./temp/test`;
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath);
        }
        const templatePath = tempPath + '/template.html';
        fs.writeFile(
            templatePath,
            template({
                helloWorld: 'Hello World',
            }),
            (err) => console.log(err),
        );

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('file:///' + cwd() + templatePath, {
            waitUntil: 'networkidle0',
        });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        //await browser.close();

        return pdf;
    }
}

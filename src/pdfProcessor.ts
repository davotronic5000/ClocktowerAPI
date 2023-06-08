import { ScriptData } from './types';
import * as handlebars from 'handlebars';
import fs from 'fs';
import * as puppeteer from 'puppeteer';
import { cwd } from 'process';

export default class PdfProcessor {
    public async createScriptPdf(
        scriptData: ScriptData,
        tempPath: string,
    ): Promise<Buffer> {
        handlebars.registerHelper(
            'divide',
            (dividend: number, divisor: number): number =>
                Math.ceil(dividend / divisor),
        );
        const templateString = fs
            .readFileSync('src/template/script.hbs')
            .toString('utf-8');
        const template = handlebars.compile(templateString);
        const templatePath = tempPath + '/template.html';
        fs.writeFile(templatePath, template(scriptData), () => {});

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('file:///' + cwd() + '/' + templatePath, {
            waitUntil: 'networkidle0',
        });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        return pdf;
    }
}

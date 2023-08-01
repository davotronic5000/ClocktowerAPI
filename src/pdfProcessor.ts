import { ScriptData } from './types';
import * as handlebars from 'handlebars';
import fs from 'fs';
import * as puppeteer from 'puppeteer';
import path from 'path';

export default class PdfProcessor {
    public async createScriptPdf(
        scriptData: ScriptData,
        tempPath: string,
    ): Promise<Buffer> {
        const templatePath = tempPath + path.sep + 'template.html';
        handlebars.registerHelper(
            'divide',
            (dividend: number, divisor: number): number =>
                Math.ceil(dividend / divisor),
        );
        handlebars.registerHelper(
            'getRelativePath',
            (filePath: string): string => {
                if (!filePath) return '';
                return path.relative(tempPath, filePath);
            },
        );
        const templateFilePath = path.resolve(
            __dirname,
            './template/script.hbs',
        );
        const templateString = fs
            .readFileSync(templateFilePath)
            .toString('utf-8');
        const template = handlebars.compile(templateString);

        fs.writeFile(templatePath, template(scriptData), () => {});
        console.log('open browser');
        const browser = await puppeteer.launch({ headless: 'new' });
        console.log('open a new tab');
        const page = await browser.newPage();
        console.log('load template');
        await page.goto(path.resolve('file:///' + __dirname, templatePath), {
            waitUntil: 'networkidle0',
        });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();
        return pdf;
    }
}

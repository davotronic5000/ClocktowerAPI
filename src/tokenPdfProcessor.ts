import * as handlebars from 'handlebars';
import fs from 'fs';
import * as puppeteer from 'puppeteer';
import path from 'path';
import { TokenData } from './types';

export default class GetTokensPdfProcessor {
    public async createTokensPdf(
        tokenData: TokenData,
        tempPath: string,
    ): Promise<Buffer> {
        const templatePath = tempPath + path.sep + 'template.html';
        handlebars.registerHelper(
            'getRelativePath',
            (filePath: string): string => {
                if (!filePath) return '';
                if (!path.isAbsolute(filePath)) {
                    filePath = path.resolve(__dirname, filePath);
                }
                return path.relative(tempPath, filePath);
            },
        );
        handlebars.registerHelper(
            'divide',
            (dividend: number, divisor: number): number => dividend / divisor,
        );
        handlebars.registerHelper('isRole', (type: 'role' | 'reminder') => {
            return type === 'role';
        });
        handlebars.registerHelper(
            'reminderPips',
            (amount: number, pip: string) => {
                let pips = '';
                for (let i = amount; i > 0; i--) {
                    pips += pip;
                }
                return pips;
            },
        );
        const templateFilePath = path.resolve(
            __dirname,
            './template/tokens.hbs',
        );
        const templateString = fs
            .readFileSync(templateFilePath)
            .toString('utf-8');
        const template = handlebars.compile(templateString);

        fs.writeFile(templatePath, template(tokenData), () => {});
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('file:///' + path.resolve(__dirname, templatePath), {
            waitUntil: 'networkidle0',
        });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });
        // await browser.close();
        return pdf;
    }
}

import * as puppeteer from 'puppeteer';
import { randomUUID } from 'crypto';
import * as handlebars from 'handlebars';
import fs from 'fs';
import { cwd } from 'process';
import { GetPdfRequest } from '../controllers/types';
import ImageFunctions from '../image/imageFunctions';

export default class PDFFunctions {
    public async createPdf(model: GetPdfRequest): Promise<Buffer> {
        handlebars.registerHelper(
            'divide',
            (dividend: number, divisor: number): number =>
                Math.ceil(dividend / divisor),
        );
        const tempPath = `src/temp/${randomUUID().toString()}`;
        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath);
        }

        const imageFunctions = new ImageFunctions();
        model = await imageFunctions.processRoleImages(model, tempPath);
        const coverImage = await imageFunctions.colorizeCover(
            model.colour,
            tempPath,
        );

        const templateString = fs
            .readFileSync('src/pdf/template/script.hbs')
            .toString('utf-8');
        const template = handlebars.compile(templateString);

        const templatePath = tempPath + '/template.html';
        fs.writeFile(
            templatePath,
            template({ ...model, coverImage: coverImage }),
            () => {},
        );
        //Setting headless to true will stop a browser popping up, false is useful for development
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('file:///' + cwd() + '/' + templatePath, {
            waitUntil: 'networkidle0',
        });
        const pdf = await page.pdf({ format: 'A4', printBackground: true });

        //comment out the below line to stop the browser closing for development
        await browser.close();

        fs.rmSync(tempPath, { recursive: true, force: true });

        return pdf;
    }
}

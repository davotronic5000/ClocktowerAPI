import { Body, Post, Route } from 'tsoa';
import { GetScriptBody } from './types';
import ScriptProcessor from './scriptProcessor';
import { randomUUID } from 'crypto';
import fs from 'fs';
import PdfProcessor from './pdfProcessor';

@Route('script')
export default class ScriptController {
    @Post('/')
    public async GetScript(
        @Body() requestBody: GetScriptBody,
    ): Promise<Buffer> {
        const tempPath = `src/temp/${randomUUID().toString()}`;
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);

        const scriptProcessor = new ScriptProcessor();
        const scriptData = await scriptProcessor.processScript(
            requestBody,
            tempPath,
        );
        const pdfProcessor = new PdfProcessor();
        const scriptPdf = await pdfProcessor.createScriptPdf(
            scriptData,
            tempPath,
        );

        fs.rmSync(tempPath, { recursive: true, force: true });

        return scriptPdf;
    }
}

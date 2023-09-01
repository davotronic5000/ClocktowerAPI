import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import { Body, Post, Route } from 'tsoa';
import TokensPdfProcessor from './tokenPdfProcessor';

@Route('tokens')
export default class TokensController {
    @Post('/')
    public async GetTokens(@Body() requestBody: any): Promise<Buffer> {
        const tempPathRelative = `./temp/${randomUUID().toString()}`;
        const tempPath = path.resolve(__dirname, tempPathRelative);
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);

        const pdfProcessor = new TokensPdfProcessor();
        const tokenspdf = await pdfProcessor.createTokensPdf(
            { roles: [] },
            tempPath,
        );

        fs.rmSync(tempPath, { recursive: true, force: true });

        return tokenspdf;
    }
}

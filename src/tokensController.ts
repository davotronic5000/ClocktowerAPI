import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import { Body, Post, Route } from 'tsoa';
import TokensPdfProcessor from './tokenPdfProcessor';
import { GetTokensBody } from './types';
import TokensProcessor from './tokensProcessor';

@Route('tokens')
export default class TokensController {
    @Post('/')
    public async GetTokens(
        @Body() requestBody: GetTokensBody,
    ): Promise<Buffer> {
        const tempPathRelative = `./temp/${randomUUID().toString()}`;
        const tempPath = path.resolve(__dirname, tempPathRelative);
        if (!fs.existsSync(tempPath)) fs.mkdirSync(tempPath);

        const tokensProcessor = new TokensProcessor();
        const tokensData = await tokensProcessor.processTokens(
            requestBody,
            tempPathRelative,
        );

        const pdfProcessor = new TokensPdfProcessor();
        const tokenspdf = await pdfProcessor.createTokensPdf(
            tokensData,
            tempPath,
        );

        fs.rmSync(tempPath, { recursive: true, force: true });

        return tokenspdf;
    }
}

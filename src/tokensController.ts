import { Body, Post, Route } from 'tsoa';

@Route('tokens')
export default class TokensController {
    @Post('/')
    public async GetTokens(@Body() requestBody: any): Promise<string> {
        return 'Hello';
    }
}

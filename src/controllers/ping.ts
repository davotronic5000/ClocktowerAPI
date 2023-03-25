import { Get, Route } from 'tsoa';
import { PingResponse } from './types';

@Route('ping')
export default class PingController {
    @Get('/')
    public async getMessage(): Promise<PingResponse> {
        return {
            message: 'pong',
        };
    }
}

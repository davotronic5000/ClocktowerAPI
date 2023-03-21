import { Get, Route } from 'tsoa';

interface PingResponse {
    message: String;
}

@Route('ping')
export default class PingController {
    @Get('/')
    public async getMessage(): Promise<PingResponse> {
        return {
            message: 'pong',
        };
    }
}

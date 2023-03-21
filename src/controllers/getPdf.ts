import { Get, Route } from 'tsoa';
import PDFFunctions from '../pdf/createPdf';

interface GetPdfResponse {
    pdf: Buffer;
}

@Route('getPdf')
export default class PDFController {
    @Get('/')
    public async getPdf(): Promise<GetPdfResponse> {
        const functions = new PDFFunctions();
        return { pdf: await functions.createPdf() };
    }
}

import { Get, Route } from 'tsoa';
import PDFFunctions from '../pdf/createPdf';

interface GetPdfResponse {
    filePath: string;
}

@Route('getPdf')
export default class PDFController {
    @Get('/')
    public async getPdf(): Promise<GetPdfResponse> {
        const functions = new PDFFunctions();
        await functions.getPdf();
        return { filePath: 'temp/google.pdf' };
    }
}

import { Body, Post, Route } from 'tsoa';
import PDFFunctions from '../pdf/createPdf';
import { GetPdfRequest, GetPdfResponse } from './types';

@Route('getPdf')
export default class PDFController {
    @Post()
    public async getPdf(@Body() requestBody: GetPdfRequest): Promise<Buffer> {
        const functions = new PDFFunctions();
        return await functions.createPdf();
    }
}

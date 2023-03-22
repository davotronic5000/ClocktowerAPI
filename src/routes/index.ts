import express from 'express';
import PingController from '../controllers/ping';
import PDFController from '../controllers/getPdf';
import { GetPdfRequest } from '../controllers/types';

const router = express.Router();

router.get('/ping', async (_req, res) => {
    const controller = new PingController();
    const response = await controller.getMessage();
    return res.send(response);
});

router.post<never, Buffer, GetPdfRequest, never>(
    '/getPdf',
    async (_req, res) => {
        const controller = new PDFController();
        const response = await controller.getPdf(_req.body);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=script.pdf');
        return res.send(response);
    },
);

export default router;

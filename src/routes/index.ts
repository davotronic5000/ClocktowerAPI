import express from 'express';
import PingController from '../controllers/ping';
import PDFController from '../controllers/getPdf';

const router = express.Router();

router.get('/ping', async (_req, res) => {
    const controller = new PingController();
    const response = await controller.getMessage();
    return res.send(response);
});

router.post('/getPdf', async (_req, res) => {
    const controller = new PDFController();
    const response = await controller.getPdf();
    return res.send(response.pdf);
});

export default router;

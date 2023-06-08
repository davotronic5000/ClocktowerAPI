import express from 'express';
import ScriptController from './scriptController';
import { GetScriptBody } from './types';

const router = express.Router();

router.post<never, Buffer, GetScriptBody, never>(
    '/script',
    async (_req, res) => {
        const scriptController = new ScriptController();
        const response = await scriptController.GetScript(_req.body);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=script.pdf');
        return res.send(response);
    },
);

export default router;

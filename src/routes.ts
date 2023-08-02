import express, { NextFunction } from 'express';
import ScriptController from './scriptController';
import { GetScriptBody } from './types';

const router = express.Router();

router.post<never, Buffer, GetScriptBody, never>(
    '/script',
    async (_req, res, next) => {
        try {
            const scriptController = new ScriptController();
            const response = await scriptController.GetScript(_req.body);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=script.pdf',
            );
            return res.send(response);
        } catch (error) {
            console.error('Error: ' + error);
            next(error);
        }
    },
);
export default router;

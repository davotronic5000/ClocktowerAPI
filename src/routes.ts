import express, { NextFunction } from 'express';
import ScriptController from './scriptController';
import { GetScriptBody } from './types';
import TokensController from './tokensController';

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
            next(error);
        }
    },
);

router.post<never, string, any, never>('/tokens', async (_req, res, next) => {
    try {
        const tokensController = new TokensController();
        const response = await tokensController.GetTokens(_req.body);
        return res.send(response);
    } catch (error) {
        next(error);
    }
});
export default router;

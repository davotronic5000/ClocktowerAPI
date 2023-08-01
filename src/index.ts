import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import Router from './routes';
import fs from 'fs';
import cors from 'cors';
import path from 'path';
import http from 'http';
import https from 'https';

const app = express();
app.options('*', cors());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public', { dotfiles: 'allow' }));
app.use(Router);

app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: '/swagger.json',
        },
    }),
);

http.createServer(app).listen(8081, () => 'HTTP Server running on port 8081');

const privateKeyPath = '/etc/letsencrypt/live/api.clocktower.guru/privkey.pem';
const certPath = '/etc/letsencrypt/live/api.clocktower.guru/cert.pem';
const caPath = '/etc/letsencrypt/live/api.clocktower.guru/chain.pem';
if (
    fs.existsSync(privateKeyPath) &&
    fs.existsSync(certPath) &&
    fs.existsSync(caPath)
) {
    console.log('starting https');
    const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
    const cert = fs.readFileSync(certPath, 'utf8');
    const ca = fs.readFileSync(caPath, 'utf8');
    https
        .createServer({ key: privateKey, cert: cert, ca: ca }, app)
        .listen(8082, () => 'HTTP Server running on port 8082');
}

const tempPath = path.resolve(__dirname, './temp');

process.env.VIPS_NOVECTOR = '1';
if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
}

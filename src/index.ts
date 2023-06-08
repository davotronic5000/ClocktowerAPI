import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import Router from './routes';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.options('*', cors());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('public'));
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

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening on PORT ${port}`));

if (!fs.existsSync('src/temp')) {
    fs.mkdirSync('src/temp');
}

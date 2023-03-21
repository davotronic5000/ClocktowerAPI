import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import Router from './routes';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
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

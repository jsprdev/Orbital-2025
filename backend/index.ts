/// <reference path="./types/express.d.ts" />
import express, { Express } from 'express';
import cors from 'cors';
import Routes from './controllers/index.controller';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT;
const host = process.env.HOST;
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/api', Routes);

app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`);
});



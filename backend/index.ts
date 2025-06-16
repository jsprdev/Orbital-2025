import express, { Express } from 'express';
import cors from 'cors';
import Routes from './controllers/index.controller';

const port = 3000;
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use('/api', Routes);

app.listen(port, () => {
    console.log(`Server is running at http://110.9.93.150:${port}`);
});



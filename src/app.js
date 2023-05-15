import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import router from './routers/index.routers.js';

const app = express();

app.use(express.json());
app.use(cors())
app.use(router);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(chalk.green(`Rodando em http://localhost:${PORT}`));
});
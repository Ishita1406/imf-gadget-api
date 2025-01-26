import express from 'express';
import dotenv from 'dotenv';
import router from './routes/gadgetRoutes.js';
import authRouter from './routes/authRouter.js';

dotenv.config();
const app = express();
app.use(express.json());

app.use('/auth', authRouter);

app.use('/gadgets', router);

app.listen(process.env.PORT, () => {
    console.log(`Server started at ${process.env.PORT}`);
})
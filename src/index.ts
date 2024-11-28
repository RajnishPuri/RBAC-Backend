import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

import { dbConnect } from './config/dbConnect';
import userRouter from "./routes/authRoute";
import accessRoute from "./routes/accessRoutes";
import { authMiddleware, checkRole } from "./middleware/authMiddleware";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', userRouter);
app.use('/api/admin', authMiddleware, checkRole(['admin']), accessRoute);
app.use('/api/moderator', authMiddleware, checkRole(['moderator', 'admin']), accessRoute);
app.use('/api/user', authMiddleware, checkRole(['user', 'admin', 'moderator']), accessRoute);

app.listen(PORT, () => {
    dbConnect().then(() => {
        console.log(`Server is Active on : ${PORT}`);
        console.log(`Database Connection is Established!`);
    }).catch((e) => {
        console.log(`Error While Listening : ${e}`);
    })
})
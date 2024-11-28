import express from "express";
import { Register, login, verifyUser, loggedOut } from "../controller/authUser";
import registerRateLimiter from "../middleware/ratelimiterMiddleware";

const userRouter = express.Router();

userRouter.post('/register', registerRateLimiter, Register);
userRouter.post('/verify-user', verifyUser);
userRouter.post('/login', login);
userRouter.post('/logout', loggedOut);

export default userRouter;
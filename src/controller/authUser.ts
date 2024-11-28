import User from "../models/Users";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendVerificationEmail from "../utils/sendMail";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET || "";

interface CustomRequest extends Request {
    body: {
        email: string;
        username: string;
        password: string;
        role: string;
    };
}

export const Register = async (req: CustomRequest, res: Response): Promise<any> => {
    try {
        const { email, username, password, role } = req.body;

        if (!email || !password || !username || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists, try logging in!",
            });
        }

        function generateVerificationCode(): number {
            const min = 100000;
            const max = 999999;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const verificationToken = generateVerificationCode();

        const hashedPassword = await bcrypt.hash(password, 10);

        await sendVerificationEmail(email, verificationToken);

        const newUser = {
            email,
            username,
            password: hashedPassword,
            role
        };

        const token = jwt.sign(
            { user: newUser, verificationToken: verificationToken },
            JWT_SECRET,
            { expiresIn: "10m" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
        });
    } catch (error) {
        console.error("Error during registration:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server issue in registering the user.",
        });
    }
};

export const verifyUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { otp } = req.body;
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided. Please register again!",
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            user: {
                email: string;
                username: string;
                password: string;
                role: string;
            };
            verificationToken: number;
        };

        const { user, verificationToken } = decoded;

        if (otp !== verificationToken) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP. Please register again!",
            });
        }

        const newUser = new User({
            email: user.email,
            username: user.username,
            password: user.password,
            role: user.role,
        });

        await newUser.save();

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(201).json({
            success: true,
            message: "User successfully verified and registered! You can now log in.",
        });
    } catch (error) {
        console.error("Error during user verification:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server issue during user verification.",
        });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User Doesn't Exists, Try Register!",
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(409).json({
                success: false,
                message: "Credentials are Incorrect!",
            });
        }

        const token = await jwt.sign({ username: user.username, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "5d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(201).json({
            success: true,
            message: "User logged in successfully.",
        });

    }
    catch (e) {
        console.error("Error during user Login:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server issue during user verification.",
        });
    }
}

export const loggedOut = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token found. User is not logged in.",
            });
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully.",
        });
    }
    catch (e) {
        console.error("Error during user logout:", e);
        return res.status(500).json({
            success: false,
            message: "Internal server issue during user logout.",
        });
    }
};



import { Request, Response } from "express";
import User from "../models/Users";

interface AuthenticatedUser extends Request {
    user?: { email: string, username: string, role: string }
}

export const getAllModerators = async (req: AuthenticatedUser, res: Response): Promise<any> => {
    try {


        let users;

        users = await User.find({ role: "moderator" }).select("-password");



        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found.",
            });
        }

        // Return the filtered user data
        return res.status(200).json({
            success: true,
            message: "User data retrieved successfully!",
            users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while retrieving the users.",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

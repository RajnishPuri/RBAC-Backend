import mongoose, { Schema, Document } from "mongoose";

// Define the User interface
interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    role: "admin" | "user" | "moderator";
    isVerified: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            match: [/.+@.+\..+/, "Please enter a valid email address"]
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8
        },
        role: {
            type: String,
            enum: ["admin", "user", "moderator"],
            default: "user",
            required: true
        }
    },
    { timestamps: true }
);


const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;

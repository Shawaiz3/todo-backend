import mongoose from "mongoose";
type userType = Document & {
    name: string
    email: string
    password: string
    role: string
    refreshToken : string
}
const userSchema = new mongoose.Schema<userType>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],   // only allowed values (only one can be selected)
        default: "user"            // new users will be normal users by default
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })
const userModel = mongoose.model<userType>("users", userSchema);
export default userModel;
import mongoose from "mongoose";
type userType = Document & {
    name: string
    email: string
    password: string
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
    }
}, { timestamps: true })
const userModel = mongoose.model<userType>("users", userSchema);
export default userModel;
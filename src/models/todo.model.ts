import mongoose from "mongoose";
type todoType = Document & {
    task: string
    userId: mongoose.Types.ObjectId; 
}
const todoSchema = new mongoose.Schema<todoType>({
    task: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // foreign key
        ref: "User",
        required: true
    }

}, { timestamps: true })
const todoModel = mongoose.model<todoType>("tasks", todoSchema);
export default todoModel;
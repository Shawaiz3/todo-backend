import mongoose from "mongoose";
type todoType = Document & {
    task: string
}
const todoSchema = new mongoose.Schema<todoType>({
    task: {
        type: String,
        required: true
    }
}, { timestamps: true })
const todoModel = mongoose.model<todoType>("tasks", todoSchema);
export default todoModel;
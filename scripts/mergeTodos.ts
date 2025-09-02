import mongoose from "mongoose";
import Todo from "../src/models/todo.model";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI as string;
const myUserId = "68afef7ec8b582e04cacc2ba";

async function mergeTodos(): Promise<void> {
    try {
        // 1. Connect to DB
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        // 2. Fetch all todos
        const todos = await Todo.find().lean();
        console.log(`Found ${todos.length} todos`);

        // 3. Delete my old todos
        await Todo.deleteMany({ userId: myUserId });
        console.log("Deleted my old todos");

        // 4. Duplicate and reassign todos
        const newTodos = todos.map((t) => ({
            task: t.task,
            status: t.status,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            userId: myUserId,
        }));

        await Todo.insertMany(newTodos);
        console.log("Reassigned all todos to my account");
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

mergeTodos();

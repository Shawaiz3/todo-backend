"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const todo_model_1 = __importDefault(require("../src/models/todo.model"));
require("dotenv/config");
const MONGO_URI = process.env.MONGO_URI;
const myUserId = "68afef7ec8b582e04cacc2ba";
async function mergeTodos() {
    try {
        // 1. Connect to DB
        await mongoose_1.default.connect(MONGO_URI);
        console.log("Connected to DB");
        // 2. Fetch all todos
        const todos = await todo_model_1.default.find().lean();
        console.log(`Found ${todos.length} todos`);
        // 3. Delete my old todos
        await todo_model_1.default.deleteMany({ userId: myUserId });
        console.log("Deleted my old todos");
        // 4. Duplicate and reassign todos
        const newTodos = todos.map((t) => ({
            task: t.task,
            status: t.status,
            createdAt: t.createdAt,
            updatedAt: t.updatedAt,
            userId: myUserId,
        }));
        await todo_model_1.default.insertMany(newTodos);
        console.log("Reassigned all todos to my account");
        process.exit(0);
    }
    catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}
mergeTodos();

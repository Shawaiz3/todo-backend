import { Request, Response } from "express";
import todoModel from "../models/todo.model";
import { querySchema } from "../middlewares/queryValidation"

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        role: string;
        name?: string;
        email?: string;
    };
}


export const createTodos = async (req: AuthRequest, res: Response) => {
    const taskCreated = await todoModel.create({
        task: req.body.task,
        userId: req.user?.userId
    })
    res.status(201).json({ taskCreated });
};

export const listTodos = async (req: AuthRequest, res: Response) => {
    const { error, value } = querySchema.validate(req.query);

    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { page, limit, search, status, sort } = value; // now defaults are applied
    const jump = (page - 1) * limit;
    const filter: any = { userId: req.user?.userId };
    if (status) {
        filter.status = String(status).toLowerCase(); // pending or completed
    }
    if (search && search.trim() !== "") {
        filter.task = { $regex: search, $options: "i" };
    }
    const totalTodos = await todoModel.countDocuments(filter); // For total no of todos

    const sortOrder = sort === "oldest" ? 1 : -1;     // Default sorting = latest first

    const data = await todoModel.find(filter).skip(jump).limit(limit).sort({ createdAt: sortOrder });;
    if (data.length == 0) {
        res.status(200).json({ message: `No data found!` });
    }
    res.status(200).json({
        totalTodos,
        data
    });
}

export const updateTodos = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { task, status } = req.body;

  // Build the update object
  const updateData: any = { task, status };

  // If status is being updated to "completed", set completedAt timestamp
  if (status === "completed") {
    updateData.completedAt = new Date();
  } else if (status === "pending") {
    // optional: clear completedAt if reverting back to pending
    updateData.completedAt = null;
  }

  await todoModel.findByIdAndUpdate(id, updateData, { new: true });

  res.status(200).json({ message: `Updated record at id = ${id}` });
};


export const deleteTodos = async (req: Request, res: Response) => {
    const id = req.params.id;
    await todoModel.findByIdAndDelete(id);
    res.status(200).send({ message: `Deleted record at id = ${id}` });
}
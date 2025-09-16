import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';
import { CreateTodoDto, UpdateTodoDto, TodoQueryDto } from './dto';

@Injectable()
export class TodoService {
    constructor(@InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>) {}

    async create(task: string, userId: string) {
        const created = await this.todoModel.create({ task, userId: new Types.ObjectId(userId) });
        return { taskCreated: created };
    }

    async list(userId: string, query: TodoQueryDto) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 5;
        const jump = (page - 1) * limit;
        const filter: any = { userId: new Types.ObjectId(userId) };
        if (query.status) filter.status = String(query.status).toLowerCase();
        if (query.search && query.search.trim() !== '') {
            filter.task = { $regex: query.search, $options: 'i' };
        }
        const totalTodos = await this.todoModel.countDocuments(filter);
        const sortOrder = query.sort === 'oldest' ? 1 : -1;
        const data = await this.todoModel
            .find(filter)
            .skip(jump)
            .limit(limit)
            .sort({ createdAt: sortOrder });
        if (data.length === 0) return { message: 'No data found!' };
        return { totalTodos, data };
    }

    async update(id: string, dto: UpdateTodoDto) {
        const updateData: any = { ...dto };
        if (dto.status === 'completed') updateData.completedAt = new Date();
        if (dto.status === 'pending') updateData.completedAt = null;
        const updated = await this.todoModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) throw new NotFoundException('No Data Found!');
        return { message: `Updated record at id = ${id}` };
    }

    async delete(id: string) {
        const deleted = await this.todoModel.findByIdAndDelete(id);
        if (!deleted) throw new NotFoundException('No Data Found!');
        return { message: `Deleted record at id = ${id}` };
    }
}



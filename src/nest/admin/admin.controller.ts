import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/user.schema';
import { Todo, TodoDocument } from '../todo/todo.schema';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/admin')
export class AdminController {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        @InjectModel(Todo.name) private readonly todoModel: Model<TodoDocument>,
    ) {}

    @Roles('admin')
    @Get('user')
    async getUsers(@Query() query: any) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 5);
        const search = query.search as string | undefined;
        const sort = (query.sort as string) ?? 'latest';
        const jump = (page - 1) * limit;

        const filter: any = {};
        if (search && search.trim() !== '') filter.name = { $regex: search, $options: 'i' };
        const sortOrder = sort === 'oldest' ? 1 : -1;

        const totalUsers = await this.userModel.countDocuments(filter);
        const users = await this.userModel.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: 'tasks',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'todos',
                },
            },
            { $addFields: { totalTodos: { $size: '$todos' } } },
            { $sort: { createdAt: sortOrder } },
            { $skip: jump },
            { $limit: limit },
            { $project: { name: 1, email: 1, totalTodos: 1 } },
        ]);
        if (users.length === 0) return { message: 'No data found!' };
        return { totalUsers, users };
    }

    @Roles('admin')
    @Get('todo')
    async listAllTodos(@Query() query: any) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 5);
        const search = query.search as string | undefined;
        const status = query.status as string | undefined;
        const last24h = query.last24h as string | undefined;
        const sort = (query.sort as string) ?? 'latest';
        const jump = (page - 1) * limit;

        const filter: any = {};
        if (status) filter.status = String(status).toLowerCase();
        if (last24h === 'true') {
            const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
            filter.createdAt = { $gte: cutoff };
        }
        if (search && search.trim() !== '') filter.task = { $regex: search, $options: 'i' };
        const sortOrder = sort === 'oldest' ? 1 : -1;

        const totalTodos = await this.todoModel.countDocuments(filter);
        const data = await this.todoModel.find(filter).skip(jump).limit(limit).sort({ createdAt: sortOrder });
        if (data.length === 0) return { message: 'No data found!' };
        return { totalTodos, data };
    }

    @Roles('admin')
    @Get('avg-todo')
    async averageTodosByUsers() {
        const result = await this.todoModel.aggregate([
            { $group: { _id: '$userId', total: { $sum: 1 } } },
            { $group: { _id: null, avgTodos: { $avg: '$total' } } },
            { $project: { _id: 0, avgTodos: 1 } },
        ]);
        return result[0] || { avgTodos: 0 };
    }

    @Roles('admin')
    @Get('completed/daily-stats')
    async dailyCompletedTaskCount() {
        const stats = await this.todoModel.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
                    total: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        if (stats.length === 0) return { message: 'No data found!' };
        return { success: true, data: stats };
    }
}



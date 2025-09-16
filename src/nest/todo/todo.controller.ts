import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto, TodoQueryDto, UpdateTodoDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('api/todo')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post()
    create(@Body() dto: CreateTodoDto, @Req() req: Request) {
        const userId = (req as any).user.userId as string;
        return this.todoService.create(dto.task, userId);
    }

    @Get()
    list(@Req() req: Request, @Query() query: TodoQueryDto) {
        const userId = (req as any).user.userId as string;
        return this.todoService.list(userId, query);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
        return this.todoService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.todoService.delete(id);
    }
}



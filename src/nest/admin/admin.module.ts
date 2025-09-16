import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { User, UserSchema } from '../user/user.schema';
import { Todo, TodoSchema } from '../todo/todo.schema';
import { RolesGuard } from '../auth/roles.guard';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Todo.name, schema: TodoSchema },
        ]),
    ],
    controllers: [AdminController],
    providers: [RolesGuard],
})
export class AdminModule {}



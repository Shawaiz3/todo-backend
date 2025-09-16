import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { AdminModule } from './admin/admin.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI as string),
        UserModule,
        TodoModule,
        AdminModule,
    ],
})
export class AppModule {}



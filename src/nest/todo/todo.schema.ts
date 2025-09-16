import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TodoDocument = HydratedDocument<Todo>;

@Schema({ timestamps: true })
export class Todo {
    @Prop({ type: String, required: true })
    task!: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId!: Types.ObjectId;

    @Prop({ type: Date })
    completedAt?: Date | null;

    @Prop({ type: String, enum: ['pending', 'completed'], default: 'pending' })
    status!: string;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);



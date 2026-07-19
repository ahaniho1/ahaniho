import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true, collection: 'tasks' })
export class Task {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedTo: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  assignedBy: string;

  @Prop({
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  })
  priority: string;

  @Prop()
  dueDate: Date;

  @Prop()
  completedAt: Date;

  @Prop({ default: 0, min: 0, max: 100 })
  progressPercentage: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
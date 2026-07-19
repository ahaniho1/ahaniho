import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true, collection: 'comments' })
export class Comment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Article', required: true })
  articleId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment', default: null })
  parentId: string;

  @Prop({ required: true, trim: true })
  authorName: string;

  @Prop({ lowercase: true, trim: true })
  authorEmail: string;

  @Prop({ required: true, trim: true })
  content: string;

  @Prop({
    type: String,
    enum: ['visible', 'hidden', 'deleted'],
    default: 'visible',
  })
  status: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
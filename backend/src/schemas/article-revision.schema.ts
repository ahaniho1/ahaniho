import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ArticleRevisionDocument = ArticleRevision & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'articlerevisions' })
export class ArticleRevision {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Article', required: true })
  articleId: string;

  @Prop({ required: true })
  revisionNumber: number;

  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop()
  excerpt: string;

  @Prop()
  changesSummary: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  revisedBy: string;
}

export const ArticleRevisionSchema = SchemaFactory.createForClass(ArticleRevision);
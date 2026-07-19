import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true, collection: 'articles' })
export class Article {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ trim: true })
  excerpt: string;

  @Prop({ default: '' })
  content: string;

  @Prop({ default: '' })
  featuredImageUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  categoryId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  authorId: string;

  @Prop({
    type: String,
    enum: ['draft', 'pending', 'approved', 'published', 'rejected', 'archived'],
    default: 'draft',
  })
  status: string;

  @Prop()
  publishedAt: Date;

  @Prop({ default: '' })
  metaTitle: string;

  @Prop({ default: '' })
  metaDescription: string;

  @Prop({ default: false })
  isPremium: boolean;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: 0 })
  shareCount: number;

  @Prop({ default: 0 })
  commentCount: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  videoUrl: string;

  @Prop({ default: '' })
  videoType: string;

  @Prop({ default: '' })
  thumbnailUrl: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
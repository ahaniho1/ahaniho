import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ArticleLikeDocument = ArticleLike & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'article_likes' })
export class ArticleLike {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Article', required: true })
  articleId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  userId: string;

  @Prop({ trim: true })
  deviceFingerprint: string;
}

export const ArticleLikeSchema = SchemaFactory.createForClass(ArticleLike);
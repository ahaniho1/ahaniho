import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ArticleShareDocument = ArticleShare & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'article_shares' })
export class ArticleShare {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Article', required: true })
  articleId: string;

  @Prop({
    type: String,
    required: true,
    enum: ['facebook', 'twitter', 'whatsapp', 'copy_link', 'linkedin', 'other'],
  })
  sharedOn: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  userId: string;

  @Prop({ trim: true })
  deviceFingerprint: string;
}

export const ArticleShareSchema = SchemaFactory.createForClass(ArticleShare);
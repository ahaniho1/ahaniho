import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AnalyticsDocument = Analytics & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false }, collection: 'analytics' })
export class Analytics {
  @Prop({
    type: String,
    required: true,
    enum: [
      'article_view',
      'ad_click',
      'ad_impression',
      'comment_added',
      'search_query',
      'article_like',
      'article_share',
    ],
  })
  eventType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Article' })
  articleId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Advertisement' })
  advertisementId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop()
  userAgent: string;

  @Prop()
  ipAddress: string;

  @Prop()
  referrerUrl: string;

  @Prop()
  sessionId: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
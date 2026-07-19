import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from '../../schemas/comment.schema';
import { Analytics, AnalyticsSchema } from '../../schemas/analytics.schema';
import { CommentsController } from './comments.controller';
import { Notification, NotificationSchema } from '../../schemas/notification.schema';
import { Article, ArticleSchema } from '../../schemas/article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
  { name: Comment.name, schema: CommentSchema },
  { name: Analytics.name, schema: AnalyticsSchema },
  { name: Notification.name, schema: NotificationSchema },
  { name: Article.name, schema: ArticleSchema },
]),
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
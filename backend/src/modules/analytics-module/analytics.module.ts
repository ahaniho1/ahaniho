import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Analytics, AnalyticsSchema } from '../../schemas/analytics.schema';
import { Article, ArticleSchema } from '../../schemas/article.schema';
import { Comment, CommentSchema } from '../../schemas/comment.schema';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Analytics.name, schema: AnalyticsSchema },
      { name: Article.name, schema: ArticleSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
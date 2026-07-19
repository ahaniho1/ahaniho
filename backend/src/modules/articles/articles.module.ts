import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from '../../schemas/article.schema';
import { ArticleLike, ArticleLikeSchema } from '../../schemas/article-like.schema';
import { Analytics, AnalyticsSchema } from '../../schemas/analytics.schema';
import { AuditLog, AuditLogSchema } from '../../schemas/audit-log.schema';
import { ArticlesController } from './articles.controller';
import { Notification, NotificationSchema } from '../../schemas/notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
      { name: Analytics.name, schema: AnalyticsSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [ArticlesController],
})
export class ArticlesModule {}
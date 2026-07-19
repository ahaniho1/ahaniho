import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analytics, AnalyticsDocument } from '../../schemas/analytics.schema';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { Comment, CommentDocument } from '../../schemas/comment.schema';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    @InjectModel(Analytics.name) private analyticsModel: Model<AnalyticsDocument>,
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  @Get('summary')
  async getSummary() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [dailyViews, weeklyViews, monthlyViews, allTimeViews, totalComments, allArticles] = await Promise.all([
      this.analyticsModel.countDocuments({ eventType: 'article_view', createdAt: { $gte: today } }),
      this.analyticsModel.countDocuments({ eventType: 'article_view', createdAt: { $gte: weekAgo } }),
      this.analyticsModel.countDocuments({ eventType: 'article_view', createdAt: { $gte: monthAgo } }),
      this.analyticsModel.countDocuments({ eventType: 'article_view' }),
      this.commentModel.countDocuments({ status: 'visible' }),
      this.articleModel.countDocuments({ status: 'published' }),
    ]);

    const topArticles = await this.articleModel.find({ status: 'published' }).sort({ viewCount: -1 }).limit(5).select('title slug viewCount likeCount categoryId').populate('categoryId', 'name');

    const totalArticleViews = (await this.articleModel.find({ status: 'published' })).reduce((s, a) => s + (a.viewCount || 0), 0);
    const totalViews = totalArticleViews + allTimeViews;

    return {
      daily: { views: dailyViews },
      weekly: { views: weeklyViews },
      monthly: { views: monthlyViews },
      totals: { views: totalViews, articles: allArticles, comments: totalComments },
      topArticles,
    };
  }

  @Post('track')
  async trackEvent(@Body() body: any) {
    return this.analyticsModel.create({
      eventType: body.eventType,
      articleId: body.articleId || undefined,
      userId: body.userId || undefined,
      sessionId: Math.random().toString(36).substring(2),
      userAgent: '',
      ipAddress: '',
    });
  }
}
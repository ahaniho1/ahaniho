import { Controller, Get, Post, Put, Delete, Param, Query, Body } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../../schemas/article.schema';
import { ArticleLike, ArticleLikeDocument } from '../../schemas/article-like.schema';
import { Analytics, AnalyticsDocument } from '../../schemas/analytics.schema';
import { AuditLog, AuditLogDocument } from '../../schemas/audit-log.schema';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';

@Controller('articles')
export class ArticlesController {
  constructor(
  @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  @InjectModel(ArticleLike.name) private articleLikeModel: Model<ArticleLikeDocument>,
  @InjectModel(Analytics.name) private analyticsModel: Model<AnalyticsDocument>,
  @InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>,
  @InjectModel(Notification.name) private notifModel: Model<NotificationDocument>,
) {}

  @Get()
  async findAll(@Query('category') category?: string, @Query('limit') limit = 50) {
    const filter: any = {};
    if (category) filter.categoryId = category;
    const articles = await this.articleModel.find(filter).populate('categoryId', 'name slug').populate('authorId', 'firstName lastName avatarUrl').sort({ createdAt: -1 }).limit(Number(limit)).select('-content');
    const total = await this.articleModel.countDocuments(filter);
    return { articles, total };
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.articleModel.findOne({ slug }).populate('categoryId', 'name slug').populate('authorId', 'firstName lastName avatarUrl');
  }
  @Post()
async create(@Body() body: any) {
  const data: any = { ...body, authorId: body.authorId || undefined };
  if (body.status === 'published' && !body.publishedAt) {
    data.publishedAt = new Date();
  }
  const article = await this.articleModel.create(data);
  await this.auditModel.create({ action: 'ARTICLE_CREATED', entityType: 'article', entityId: article._id.toString(), newValues: { title: article.title, status: article.status } });
  return this.articleModel.findById(article._id).populate('categoryId').populate('authorId');
}

  @Put(':id')
async update(@Param('id') id: string, @Body() body: any) {
  const old = await this.articleModel.findById(id);
  const updateData: any = { ...body };
  if (body.status === 'published' && old && !old.publishedAt) {
    updateData.publishedAt = new Date();
  }
  await this.articleModel.findByIdAndUpdate(id, updateData);
  
  if (body.status && old && old.status !== body.status) {
    const action = body.status === 'published' ? 'ARTICLE_APPROVED' : body.status === 'rejected' ? 'ARTICLE_REJECTED' : 'ARTICLE_UPDATED';
    await this.auditModel.create({ action, entityType: 'article', entityId: id, oldValues: { status: old.status }, newValues: { status: body.status } });
    
    // Send notification to author
    if (old.authorId && (body.status === 'published' || body.status === 'rejected')) {
      await this.notifModel.create({
        userId: old.authorId.toString(),
        type: body.status === 'published' ? 'article_approved' : 'article_rejected',
        title: body.status === 'published' ? 'Article Approved' : 'Article Rejected',
        message: `Your article "${old.title}" has been ${body.status}.`,
        isRead: false,
      });
    }
  }
  
  return this.articleModel.findById(id).populate('categoryId').populate('authorId');
}

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const article = await this.articleModel.findById(id);
    await this.articleModel.findByIdAndDelete(id);
    if (article) {
      await this.auditModel.create({ action: 'ARTICLE_DELETED', entityType: 'article', entityId: id, oldValues: { title: article.title } });
    }
    return { message: 'Article deleted successfully' };
  }

  @Post(':id/like')
  async likeArticle(@Param('id') id: string, @Body() body: { userId?: string; deviceFingerprint?: string }) {
    const article = await this.articleModel.findById(id);
    if (!article) return { error: 'Article not found' };
    const fingerprint = body.deviceFingerprint || body.userId || 'unknown';
    const existingLike = await this.articleLikeModel.findOne({ articleId: id, deviceFingerprint: fingerprint });
    if (existingLike) {
      await this.articleLikeModel.deleteOne({ _id: existingLike._id });
      article.likeCount = Math.max(0, article.likeCount - 1);
      await article.save();
      return { likeCount: article.likeCount, liked: false };
    }
    await this.articleLikeModel.create({ articleId: id, userId: body.userId || undefined, deviceFingerprint: fingerprint });
    article.likeCount += 1;
    await article.save();
    return { likeCount: article.likeCount, liked: true };
  }

  @Post(':id/view')
  async trackView(@Param('id') id: string, @Body() body: { sessionId: string }) {
    const article = await this.articleModel.findById(id);
    if (!article) return { viewCount: 0 };
    const sessionId = body.sessionId;
    if (!sessionId) return { viewCount: article.viewCount };
    if (!(globalThis as any).viewTracker) (globalThis as any).viewTracker = {};
    const key = `view_${id}_${sessionId}`;
    if (!(globalThis as any).viewTracker[key]) {
      (globalThis as any).viewTracker[key] = true;
      article.viewCount += 1;
      await article.save();
      await this.analyticsModel.create({ eventType: 'article_view', articleId: id, sessionId });
    }
    return { viewCount: article.viewCount };
  }
}
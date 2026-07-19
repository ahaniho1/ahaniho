import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../../schemas/comment.schema';
import { Analytics, AnalyticsDocument } from '../../schemas/analytics.schema';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';
import { Article, ArticleDocument } from '../../schemas/article.schema';

@Controller('comments')
export class CommentsController {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Analytics.name) private analyticsModel: Model<AnalyticsDocument>,
    @InjectModel(Notification.name) private notifModel: Model<NotificationDocument>,
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  @Get()
  async findAll(@Query('articleId') articleId?: string) {
    const filter: any = {};
    if (articleId) filter.articleId = articleId;
    return this.commentModel.find(filter).sort({ createdAt: -1 });
  }

  @Post()
async create(@Body() body: any) {
  const comment = await this.commentModel.create({ ...body, status: 'visible' });
  await this.analyticsModel.create({ eventType: 'comment_added', articleId: body.articleId, sessionId: Math.random().toString(36).substring(2) });
  
  // Notify article author
  const article = await this.articleModel.findById(body.articleId);
  if (article && article.authorId) {
    await this.notifModel.create({
      userId: article.authorId.toString(),
      type: 'new_comment',
      title: 'New Comment',
      message: `${body.authorName} commented on "${article.title}".`,
      isRead: false,
    });
  }
  
  return comment;
}

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.commentModel.findByIdAndUpdate(id, body, { new: true });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.commentModel.findByIdAndDelete(id);
    return { message: 'Comment deleted' };
  }
}
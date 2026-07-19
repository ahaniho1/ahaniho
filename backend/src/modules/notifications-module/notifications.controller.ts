import { Controller, Get, Post, Put, Param, Body, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../../schemas/notification.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(@InjectModel(Notification.name) private notifModel: Model<NotificationDocument>) {}

  @Get()
  async findAll(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return [];
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'ahan-iho-access-secret-key-2026');
      return this.notifModel.find({ userId: decoded.sub }).sort({ createdAt: -1 }).limit(20);
    } catch { return []; }
  }

  @Get('unread-count')
  async unreadCount(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return { count: 0 };
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'ahan-iho-access-secret-key-2026');
      const count = await this.notifModel.countDocuments({ userId: decoded.sub, isRead: false });
      return { count };
    } catch { return { count: 0 }; }
  }

  @Put(':id/read')
  async markRead(@Param('id') id: string) {
    return this.notifModel.findByIdAndUpdate(id, { isRead: true });
  }

  @Put('mark-all-read')
  async markAllRead(@Req() req: any) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return { error: 'No token' };
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'ahan-iho-access-secret-key-2026');
      await this.notifModel.updateMany({ userId: decoded.sub, isRead: false }, { isRead: true });
      return { message: 'All marked read' };
    } catch { return { error: 'Failed' }; }
  }
}
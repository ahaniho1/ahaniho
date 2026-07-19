import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from '../../schemas/audit-log.schema';

@Controller('audit-logs')
export class AuditController {
  constructor(@InjectModel(AuditLog.name) private auditModel: Model<AuditLogDocument>) {}

  @Get()
  async findAll() {
    return this.auditModel.find().populate('userId', 'firstName lastName').sort({ createdAt: -1 }).limit(100);
  }
}
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role, RoleDocument } from '../schemas/role.schema';
import { Permission, PermissionDocument } from '../schemas/permission.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Setting, SettingDocument } from '../schemas/setting.schema';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
    @InjectModel(Permission.name) private permissionModel: Model<PermissionDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Setting.name) private settingModel: Model<SettingDocument>,
  ) {}

  async seed() {
    this.logger.log('Starting database seed...');
    await this.seedRoles();
    await this.seedPermissions();
    await this.seedCategories();
    await this.seedAdminUser();
    await this.seedSettings();
    this.logger.log('Database seeding complete!');
  }

  private async seedRoles() {
    const count = await this.roleModel.countDocuments();
    if (count > 0) { this.logger.log('Roles already exist, skipping...'); return; }
    await this.roleModel.insertMany([
      { name: 'Administrator', slug: 'administrator', description: 'Full system access and control' },
      { name: 'Publisher', slug: 'publisher', description: 'Content creator' },
      { name: 'Service Staff', slug: 'service_staff', description: 'Task executor' },
      { name: 'Public User', slug: 'public_user', description: 'Read-only visitor' },
    ]);
    this.logger.log('Roles created');
  }

  private async seedPermissions() {
    const count = await this.permissionModel.countDocuments();
    if (count > 0) { this.logger.log('Permissions already exist, skipping...'); return; }
    await this.permissionModel.insertMany([
      { name: 'Create Users', slug: 'create_users', resource: 'users', action: 'create' },
      { name: 'Read Users', slug: 'read_users', resource: 'users', action: 'read' },
      { name: 'Update Users', slug: 'update_users', resource: 'users', action: 'update' },
      { name: 'Delete Users', slug: 'delete_users', resource: 'users', action: 'delete' },
      { name: 'Create Articles', slug: 'create_articles', resource: 'articles', action: 'create' },
      { name: 'Read Articles', slug: 'read_articles', resource: 'articles', action: 'read' },
      { name: 'Update Articles', slug: 'update_articles', resource: 'articles', action: 'update' },
      { name: 'Delete Articles', slug: 'delete_articles', resource: 'articles', action: 'delete' },
      { name: 'Submit Articles', slug: 'submit_articles', resource: 'articles', action: 'submit' },
      { name: 'Approve Articles', slug: 'approve_articles', resource: 'articles', action: 'approve' },
      { name: 'Reject Articles', slug: 'reject_articles', resource: 'articles', action: 'reject' },
      { name: 'Publish Articles', slug: 'publish_articles', resource: 'articles', action: 'publish' },
      { name: 'Manage Categories', slug: 'manage_categories', resource: 'categories', action: 'manage' },
      { name: 'Moderate Comments', slug: 'moderate_comments', resource: 'comments', action: 'moderate' },
      { name: 'Delete Comments', slug: 'delete_comments', resource: 'comments', action: 'delete' },
      { name: 'Manage Advertisements', slug: 'manage_advertisements', resource: 'advertisements', action: 'manage' },
      { name: 'View All Analytics', slug: 'view_all_analytics', resource: 'analytics', action: 'view_all' },
      { name: 'View Own Analytics', slug: 'view_own_analytics', resource: 'analytics', action: 'view_own' },
      { name: 'Create Tasks', slug: 'create_tasks', resource: 'tasks', action: 'create' },
      { name: 'Manage Tasks', slug: 'manage_tasks', resource: 'tasks', action: 'manage' },
      { name: 'View Own Tasks', slug: 'view_own_tasks', resource: 'tasks', action: 'view_own' },
      { name: 'Update Task Progress', slug: 'update_task_progress', resource: 'tasks', action: 'update_progress' },
      { name: 'View Audit Logs', slug: 'view_audit_logs', resource: 'audit_logs', action: 'view' },
      { name: 'Manage Settings', slug: 'manage_settings', resource: 'settings', action: 'manage' },
      { name: 'View Notifications', slug: 'view_notifications', resource: 'notifications', action: 'view' },
      { name: 'Manage Notifications', slug: 'manage_notifications', resource: 'notifications', action: 'manage' },
    ]);
    this.logger.log('Permissions created');
  }

  private async seedCategories() {
    const count = await this.categoryModel.countDocuments();
    if (count > 0) { this.logger.log('Categories already exist, skipping...'); return; }
    await this.categoryModel.insertMany([
      { name: 'AI Training', slug: 'ai-trends', description: 'Artificial intelligence and machine learning', parentId: null, isActive: true, sortOrder: 1 },
      { name: 'Psychology Facts', slug: 'real-and-fact', description: 'Human behavior and mental wellness', parentId: null, isActive: true, sortOrder: 2 },
      { name: 'Financial Literacy', slug: 'finewave', description: 'Personal finance and investing', parentId: null, isActive: true, sortOrder: 3 },
    ]);
    this.logger.log('Categories created');
  }

  private async seedAdminUser() {
    const existing = await this.userModel.findOne({ email: process.env.ADMIN_EMAIL || 'vugatime@gmail.com' });
    if (existing) { this.logger.log('Admin user already exists, skipping...'); return; }
    const role = await this.roleModel.findOne({ slug: 'administrator' });
    if (!role) { this.logger.error('Admin role not found!'); return; }
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Joselove@250', 10);
    await this.userModel.create({
      email: process.env.ADMIN_EMAIL || 'vugatime@gmail.com',
      passwordHash: hash,
      firstName: 'Admin',
      lastName: 'User',
      roleId: role._id.toString(),
      isActive: true,
    } as any);
    this.logger.log('Admin user created');
  }

  private async seedSettings() {
    const count = await this.settingModel.countDocuments();
    if (count > 0) { this.logger.log('Settings already exist, skipping...'); return; }
    await this.settingModel.insertMany([
      { key: 'site_name', value: 'Aha Secret Max' },
      { key: 'site_description', value: 'Professional Content Publishing Platform' },
      { key: 'default_language', value: 'en' },
      { key: 'enable_comments', value: true },
      { key: 'maintenance_mode', value: false },
    ]);
    this.logger.log('Settings created');
  }
}
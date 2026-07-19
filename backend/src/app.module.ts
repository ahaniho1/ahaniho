import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CommentsModule } from './modules/comments/comments.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users-controller/users.module';
import { SettingsModule } from './modules/settings/settings.module';
import { TasksModule } from './modules/tasks-module/tasks.module';
import { AdsModule } from './modules/ads-module/ads.module';
import { AnalyticsModule } from './modules/analytics-module/analytics.module';
import { NotificationsModule } from './modules/notifications-module/notifications.module';
import { AuditModule } from './modules/audit-module/audit.module';

// Schema imports for seed
import { Role, RoleSchema } from './schemas/role.schema';
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { User, UserSchema } from './schemas/user.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { Article, ArticleSchema } from './schemas/article.schema';
import { ArticleRevision, ArticleRevisionSchema } from './schemas/article-revision.schema';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { ArticleLike, ArticleLikeSchema } from './schemas/article-like.schema';
import { ArticleShare, ArticleShareSchema } from './schemas/article-share.schema';
import { Advertisement, AdvertisementSchema } from './schemas/advertisement.schema';
import { Analytics, AnalyticsSchema } from './schemas/analytics.schema';
import { Task, TaskSchema } from './schemas/task.schema';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';
import { Media, MediaSchema } from './schemas/media.schema';
import { Setting, SettingSchema } from './schemas/setting.schema';
import { SeedService } from './seed/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ uri: config.get<string>('MONGODB_URI') }),
    }),
    MongooseModule.forFeature([
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleRevision.name, schema: ArticleRevisionSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
      { name: ArticleShare.name, schema: ArticleShareSchema },
      { name: Advertisement.name, schema: AdvertisementSchema },
      { name: Analytics.name, schema: AnalyticsSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Notification.name, schema: NotificationSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: Media.name, schema: MediaSchema },
      { name: Setting.name, schema: SettingSchema },
    ]),
    ArticlesModule,
    AuthModule,
    CategoriesModule,
    CommentsModule,
    RolesModule,
    UsersModule,
    SettingsModule,
    TasksModule,
    AdsModule,
    AnalyticsModule,
    NotificationsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
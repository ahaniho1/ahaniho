import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ default: '', trim: true })
  lastName: string;

  @Prop({ default: '' })
  avatarUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  roleId: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin: Date;

  @Prop()
  refreshTokenHash: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Category', default: [] })
  assignedCategories: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
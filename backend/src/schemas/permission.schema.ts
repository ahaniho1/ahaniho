import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema({ timestamps: true, collection: 'permissions' })
export class Permission {
  @Prop({ required: true, unique: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ required: true, lowercase: true, trim: true })
  resource: string;

  @Prop({ required: true, lowercase: true, trim: true })
  action: string;

  @Prop({ trim: true })
  description: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
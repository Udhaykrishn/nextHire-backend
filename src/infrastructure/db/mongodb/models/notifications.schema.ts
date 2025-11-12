import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  notification_type: string;

  @Prop({ required: true })
  descriptions: string;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: true, default: false })
  is_read: boolean;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  role: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
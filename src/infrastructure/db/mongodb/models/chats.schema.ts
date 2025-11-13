import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  @Prop({ required: true, type: String })
  sender_id: string;

  @Prop({ required: true, type: Date })
  created_at: Date;

  @Prop({ required: true, type: String })
  receiver_id: string;

  @Prop({ required: true, default: false })
  is_viewed: boolean;

  @Prop({ required: true })
  message: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
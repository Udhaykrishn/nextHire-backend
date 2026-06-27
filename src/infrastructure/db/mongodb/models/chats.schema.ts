import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

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

	@Prop({ type: String, default: "text", enum: ["text", "image", "document"] })
	message_type: string;

	@Prop({ type: String, default: null })
	file_url: string | null;

	@Prop({ type: String, default: null })
	file_name: string | null;

	@Prop({ type: Number, default: null })
	file_size: number | null;

	@Prop({ type: String, default: null })
	file_key: string | null;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

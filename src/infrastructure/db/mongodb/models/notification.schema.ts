import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true })
export class Notification {
	@Prop({ required: true })
	recipient_id: string;

	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	message: string;

	@Prop({ required: true, default: false })
	is_read: boolean;

	@Prop({ type: String, default: "info" })
	type: string;

	@Prop({ type: Object, default: {} })
	metadata: Record<string, unknown>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

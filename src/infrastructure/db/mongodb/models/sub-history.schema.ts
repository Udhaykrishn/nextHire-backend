import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type SubscriptionHistoryDocument = HydratedDocument<SubscriptionHistory>;

@Schema({ timestamps: true })
export class SubscriptionHistory {
	@Prop({ required: true })
	user_id: string;

	@Prop({ required: true })
	payment_method: string;

	@Prop({ required: true })
	created_at: string;

	@Prop({ required: true })
	subscription_id: string;

	@Prop({ required: true })
	status: string;

	@Prop({ required: true })
	role: string;
}

export const SubscriptionHistorySchema =
	SchemaFactory.createForClass(SubscriptionHistory);

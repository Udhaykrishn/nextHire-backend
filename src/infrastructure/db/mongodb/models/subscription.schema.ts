import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ timestamps: true })
export class Subscription {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	created_at: string;

	@Prop({ required: true })
	status: string;

	@Prop({ required: true })
	amount: string;

	@Prop({ required: true })
	subscription_type: string;

	@Prop({ required: true })
	descriptions: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

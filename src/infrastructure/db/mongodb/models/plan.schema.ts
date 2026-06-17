import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class PlanDocument extends Document {
	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	price: string;

	@Prop()
	period?: string;

	@Prop({ required: true })
	description: string;

	@Prop({ required: true, enum: ["zap", "crown", "shield"] })
	iconType: string;

	@Prop({ type: [String], required: true })
	features: string[];

	@Prop({ required: true })
	cta: string;

	@Prop({ required: true, default: false })
	highlight: boolean;

	@Prop({ required: true, enum: ["candidate", "recruiter"] })
	type: string;

	@Prop({ required: true, enum: ["Active", "Archived", "Draft", "Inactive"], default: "Draft" })
	status: string;

	@Prop({ required: true, default: 0 })
	subscribers: number;

	@Prop()
	stripePriceId?: string;
}

export const PlanSchema = SchemaFactory.createForClass(PlanDocument);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
	@Prop({ required: true, unique: true, index: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	phone: string;

	@Prop()
	GSTIN: string;

	@Prop()
	status: string;

	@Prop()
	website_link: string;

	@Prop()
	description: string;

	@Prop()
	category: string;

	@Prop({ default: "HR" })
	company_role: string;

	@Prop({ default: false })
	is_verified_company: boolean;

	@Prop({ default: false })
	admin_approved: boolean;

	@Prop({
		type: {
			current_plan: { type: String, default: "free" },
			is_subscribed: { type: Boolean, default: false },
		},
	})
	subscription: {
		current_plan: string;
		is_subscribed: boolean;
	};
}

export const CompanySchema = SchemaFactory.createForClass(Company);

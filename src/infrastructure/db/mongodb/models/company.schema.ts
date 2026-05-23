import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type HydratedDocument, type InferSchemaType } from "mongoose";
import { Role } from "./role.schema";

export type RecruiterDocument = HydratedDocument<Recruiter>;

@Schema({ timestamps: true })
export class Recruiter {
	@Prop({ required: true, unique: true, index: true })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	phone: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Role" })
	role: Role;

	@Prop()
	GSTIN: string;

	@Prop()
	CIN: string;

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

	@Prop({ default: 0 })
	job_count: number;

	@Prop({ default: false })
	is_verified_company: boolean;

	@Prop({ default: "" })
	verification_revoked_reason: string;

	@Prop({ default: false })
	admin_approved: boolean;

	@Prop({
		type: {
			key: { type: String },
			url: { type: String },
		},
		_id: false,
	})
	profile_url: {
		key: string;
		url: string;
	};

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

export const Recruiterschema = SchemaFactory.createForClass(Recruiter);
export type RecruiterType = InferSchemaType<typeof Recruiterschema> & {
	_id: string;
};

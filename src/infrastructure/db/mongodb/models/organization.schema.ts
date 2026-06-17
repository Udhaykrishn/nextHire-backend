import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { type HydratedDocument, type InferSchemaType } from "mongoose";

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
	@Prop({ required: true })
	name: string;

	@Prop()
	logo_url: string;

	@Prop()
	website: string;

	@Prop()
	industry: string;

	@Prop()
	company_size: string;

	@Prop()
	location: string;

	@Prop()
	about: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Recruiter", required: true })
	ownerId: mongoose.Types.ObjectId;

	@Prop({ default: true })
	isActive: boolean;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
export type CompanyType = InferSchemaType<typeof CompanySchema> & {
	_id: string;
};

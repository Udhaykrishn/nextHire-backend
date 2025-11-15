import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type CompanyInterviewerDocument = HydratedDocument<CompanyInterviewer>;

@Schema({ timestamps: true })
export class CompanyInterviewer {
	@Prop({ required: true })
	email: string;

	@Prop({ required: true })
	created_by: string;

	@Prop({ required: true })
	role: string;

	@Prop({ required: true })
	company_id: string;

	@Prop({ required: true })
	password: string;

	@Prop({ required: true })
	department: string;
}

export const CompanyInterviewerSchema =
	SchemaFactory.createForClass(CompanyInterviewer);

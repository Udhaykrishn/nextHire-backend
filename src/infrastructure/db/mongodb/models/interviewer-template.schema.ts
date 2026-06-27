import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type InterviewerTemplateDocument = HydratedDocument<InterviewerTemplate>;

@Schema({ timestamps: true })
export class InterviewerTemplate {
	@Prop({ required: true, index: true })
	companyId: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: false })
	description?: string;

	@Prop({ required: true })
	duration: number; // in minutes

	@Prop({ type: [String], required: true, default: [] })
	rubric: string[];
}

export const InterviewerTemplateSchema = SchemaFactory.createForClass(InterviewerTemplate);
export type InterviewerTemplateType = InferSchemaType<typeof InterviewerTemplateSchema> & {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
};

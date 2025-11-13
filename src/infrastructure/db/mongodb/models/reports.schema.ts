import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument } from "mongoose";

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
	@Prop({ required: true })
	job_id: string;

	@Prop({ required: true })
	message: string;

	@Prop({ required: true })
	user_id: string;

	@Prop({ required: true, type: Date })
	created_at: Date;

	@Prop({ required: true })
	status: string;

	@Prop({ required: true })
	reason: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);

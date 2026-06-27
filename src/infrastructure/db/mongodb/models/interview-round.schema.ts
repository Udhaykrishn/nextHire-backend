import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type InterviewRoundDocument = HydratedDocument<InterviewRound>;

@Schema({ timestamps: true })
export class InterviewRound {
	@Prop({ required: true, ref: "Application", index: true })
	applicationId: string;

	@Prop({ required: true, ref: "CompanyInterviewer", index: true })
	interviewerId: string;

	@Prop({ required: true, ref: "InterviewerTemplate" })
	templateId: string;

	@Prop({ required: true })
	scheduledAt: Date;

	@Prop({ required: true, enum: ["PENDING", "COMPLETED", "CANCELLED"], default: "PENDING" })
	status: string;

	@Prop({ required: true, unique: true, index: true })
	meetingCode: string;

	@Prop({ required: true, default: 45 })
	duration: number;

	@Prop({ required: true, enum: ["PENDING", "CONFIRMED", "DECLINED"], default: "PENDING" })
	candidateConfirmation: string;

	@Prop({ type: Boolean, default: false })
	candidateJoined: boolean;

	@Prop({ type: Boolean, default: false })
	interviewerJoined: boolean;

	@Prop({ required: true, enum: ["PENDING", "PASS", "REJECTED"], default: "PENDING" })
	candidateStatus: string;

	@Prop({ required: false })
	feedback?: string;

	@Prop({ required: false })
	score?: number;

	@Prop({ type: Map, of: Number, required: false })
	rubricRatings?: Map<string, number>;
}

export const InterviewRoundSchema = SchemaFactory.createForClass(InterviewRound);
export type InterviewRoundType = InferSchemaType<typeof InterviewRoundSchema> & {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
};

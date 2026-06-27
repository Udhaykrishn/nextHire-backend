import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type InterviewDocument = HydratedDocument<Interview>;

export enum INTERVIEW_STATUS {
	PENDING_CONFIRMATION = "PENDING_CONFIRMATION",
	CONFIRMED = "CONFIRMED",
	DECLINED = "DECLINED",
	COMPLETED = "COMPLETED",
	CANCELLED = "CANCELLED",
}

export enum ROUND_RESULT {
	PENDING = "PENDING",
	PASS = "PASS",
	REJECTED = "REJECTED",
}

@Schema({ timestamps: true })
export class Interview {
	@Prop({ required: true, ref: "Jobs" })
	jobId: string;

	@Prop({ required: true, ref: "User" })
	candidateId: string;

	@Prop({ required: true, ref: "Application" })
	applicationId: string;

	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	roundType: string;

	@Prop({ required: true, type: Date })
	scheduledAt: Date;

	@Prop({ required: true, type: Number })
	duration: number;

	@Prop({
		required: true,
		type: String,
		enum: INTERVIEW_STATUS,
		default: INTERVIEW_STATUS.PENDING_CONFIRMATION,
	})
	status: string;

	@Prop({ required: true })
	interviewerEmail: string;

	@Prop({ required: true })
	interviewerName: string;

	@Prop({ type: String, enum: ROUND_RESULT, default: ROUND_RESULT.PENDING })
	result: string;

	@Prop({ type: String, default: "" })
	feedback?: string;

	@Prop({ required: true, unique: true, index: true })
	meetingCode: string;

	@Prop({ type: Boolean, default: false })
	candidateJoined: boolean;

	@Prop({ type: Boolean, default: false })
	interviewerJoined: boolean;
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
export type InterviewType = InferSchemaType<typeof InterviewSchema> & {
	_id: string;
	createdAt: Date;
	updatedAt: Date;
};

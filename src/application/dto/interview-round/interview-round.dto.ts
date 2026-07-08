import {
	IsString,
	IsNotEmpty,
	IsOptional,
	IsNumber,
	Min,
	Max,
	IsEnum,
	IsArray,
	IsDateString,
	IsObject,
} from "class-validator";
import {
	CANDIDATE_INTERVIEW_STATUS,
	CANDIDATE_CONFIRMATION_STATUS,
} from "@/domain/enums/interview-round/interview-status.enum";

export class ScheduleRoundDto {
	@IsString()
	@IsNotEmpty()
	applicationId: string;

	@IsArray()
	@IsString({ each: true })
	interviewerIds: string[];

	@IsString()
	@IsNotEmpty()
	templateId: string;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	type: string;

	@IsString()
	@IsNotEmpty()
	timeZone: string;

	@IsString()
	@IsOptional()
	instructions?: string;

	@IsString()
	@IsOptional()
	internalNotes?: string;

	@IsDateString()
	@IsNotEmpty()
	scheduledAt: string;

	@IsNumber()
	@Min(1)
	@IsOptional()
	duration?: number;

	recruiterId?: string;
}

export class UpdateInterviewRoundDto {
	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	type?: string;

	@IsString()
	@IsOptional()
	timeZone?: string;

	@IsString()
	@IsOptional()
	instructions?: string;

	@IsString()
	@IsOptional()
	internalNotes?: string;

	@IsDateString()
	@IsOptional()
	scheduledAt?: string;

	@IsNumber()
	@Min(1)
	@IsOptional()
	duration?: number;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	interviewerIds?: string[];

	@IsString()
	@IsOptional()
	templateId?: string;

	roundId?: string;
	recruiterId?: string;
}

export class RequestRescheduleDto {
	@IsDateString()
	@IsNotEmpty()
	newScheduledAt: string;

	@IsString()
	@IsOptional()
	reason?: string;

	roundId?: string;
	requestedByUserId?: string;
}

export class ApproveRescheduleDto {
	roundId?: string;
	recruiterId?: string;
}

export class SubmitFeedbackDto {
	@IsNumber()
	@Min(1)
	@Max(10)
	score: number;

	@IsString()
	@IsNotEmpty()
	feedback: string;

	@IsObject()
	rubricRatings: Record<string, number>;

	@IsEnum(CANDIDATE_INTERVIEW_STATUS)
	candidateStatus: CANDIDATE_INTERVIEW_STATUS;

	roundId?: string;
}

export class ConfirmRoundDto {
	@IsEnum(CANDIDATE_CONFIRMATION_STATUS)
	status: CANDIDATE_CONFIRMATION_STATUS;

	roundId?: string;
}

export class JoinRoundRoomDto {
	@IsString()
	@IsNotEmpty()
	meetingCode: string;

	@IsEnum(["candidate", "interviewer"] as const)
	role: "candidate" | "interviewer";
}

import {
	INTERVIEW_ROUND_STATUS,
	CANDIDATE_CONFIRMATION_STATUS,
	CANDIDATE_INTERVIEW_STATUS,
} from "@/domain/enums/interview-round/interview-status.enum";

export class InterviewRoundEntity {
	private readonly _id?: string;
	private _applicationId: string;
	private _interviewerIds: string[];
	private _templateId: string;
	private _title: string;
	private _type: string;
	private _timeZone: string;
	private _instructions?: string;
	private _internalNotes?: string;
	private _scheduledAt: Date;
	private _status: string; // SCHEDULED, RESCHEDULED, COMPLETED, CANCELLED, NO_SHOW
	private _meetingCode: string;
	private _duration: number;
	private _candidateConfirmation: string; // PENDING, CONFIRMED, DECLINED
	private _candidateJoined: boolean;
	private _interviewerJoined: boolean;
	private _candidateStatus: string; // PENDING, PASS, REJECTED
	private _feedback?: string;
	private _score?: number;
	private _rubricRatings?: Map<string, number>;
	private _createdAt?: Date;
	private _updatedAt?: Date;

	private constructor(
		applicationId: string,
		interviewerIds: string[],
		templateId: string,
		title: string,
		type: string,
		timeZone: string,
		instructions: string | undefined,
		internalNotes: string | undefined,
		scheduledAt: Date,
		status: string,
		meetingCode: string,
		duration: number,
		candidateConfirmation: string,
		candidateJoined: boolean,
		interviewerJoined: boolean,
		candidateStatus: string,
		feedback?: string,
		score?: number,
		rubricRatings?: Map<string, number>,
		createdAt?: Date,
		updatedAt?: Date,
		id?: string,
	) {
		this._applicationId = applicationId;
		this._interviewerIds = interviewerIds;
		this._templateId = templateId;
		this._title = title;
		this._type = type;
		this._timeZone = timeZone;
		this._scheduledAt = scheduledAt;
		this._status = status;
		this._meetingCode = meetingCode;
		this._duration = duration;
		this._candidateConfirmation = candidateConfirmation;
		this._candidateJoined = candidateJoined;
		this._interviewerJoined = interviewerJoined;
		this._candidateStatus = candidateStatus;
		this._feedback = feedback;
		this._score = score;
		this._rubricRatings = rubricRatings;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._id = id;
		this._instructions = instructions;
		this._internalNotes = internalNotes;
	}

	static create(data: {
		applicationId: string;
		interviewerIds: string[];
		templateId: string;
		title: string;
		type: string;
		timeZone: string;
		instructions?: string;
		internalNotes?: string;
		scheduledAt: Date;
		status: string;
		meetingCode: string;
		duration: number;
		candidateConfirmation: string;
		candidateJoined: boolean;
		interviewerJoined: boolean;
		candidateStatus: string;
		feedback?: string;
		score?: number;
		rubricRatings?: Map<string, number>;
		createdAt?: Date;
		updatedAt?: Date;
		id?: string;
	}): InterviewRoundEntity {
		return new InterviewRoundEntity(
			data.applicationId,
			data.interviewerIds,
			data.templateId,
			data.title,
			data.type,
			data.timeZone,
			data.instructions,
			data.internalNotes,
			data.scheduledAt,
			data.status,
			data.meetingCode,
			data.duration,
			data.candidateConfirmation,
			data.candidateJoined,
			data.interviewerJoined,
			data.candidateStatus,
			data.feedback,
			data.score,
			data.rubricRatings,
			data.createdAt,
			data.updatedAt,
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get applicationId(): string {
		return this._applicationId;
	}

	get interviewerIds(): string[] {
		return this._interviewerIds;
	}

	get templateId(): string {
		return this._templateId;
	}

	get title(): string {
		return this._title;
	}

	get type(): string {
		return this._type;
	}

	get timeZone(): string {
		return this._timeZone;
	}

	get instructions(): string | undefined {
		return this._instructions;
	}

	get internalNotes(): string | undefined {
		return this._internalNotes;
	}

	get scheduledAt(): Date {
		return this._scheduledAt;
	}

	get status(): string {
		return this._status;
	}

	get meetingCode(): string {
		return this._meetingCode;
	}

	get duration(): number {
		return this._duration;
	}

	get candidateConfirmation(): string {
		return this._candidateConfirmation;
	}

	get candidateJoined(): boolean {
		return this._candidateJoined;
	}

	get interviewerJoined(): boolean {
		return this._interviewerJoined;
	}

	get candidateStatus(): string {
		return this._candidateStatus;
	}

	get feedback(): string | undefined {
		return this._feedback;
	}

	get score(): number | undefined {
		return this._score;
	}

	get rubricRatings(): Map<string, number> | undefined {
		return this._rubricRatings;
	}

	get createdAt(): Date | undefined {
		return this._createdAt;
	}

	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}

	// HR ends the live session, opening evaluation for the interviewer.
	endForEvaluation(): void {
		this._status = INTERVIEW_ROUND_STATUS.AWAITING_EVALUATION;
	}

	get canBeEvaluated(): boolean {
		return this._status === INTERVIEW_ROUND_STATUS.AWAITING_EVALUATION;
	}

	complete(score: number, feedback: string, rubricRatings: Map<string, number>): void {
		this._status = INTERVIEW_ROUND_STATUS.COMPLETED;
		this._score = score;
		this._feedback = feedback;
		this._rubricRatings = rubricRatings;
	}

	cancel(): void {
		this._status = INTERVIEW_ROUND_STATUS.CANCELLED;
	}

	reschedule(scheduledAt: Date): void {
		this._scheduledAt = scheduledAt;
		this._status = INTERVIEW_ROUND_STATUS.RESCHEDULED;
	}

	confirm(status: CANDIDATE_CONFIRMATION_STATUS): void {
		this._candidateConfirmation = status as string;
		if (status === CANDIDATE_CONFIRMATION_STATUS.DECLINED) {
			this._status = INTERVIEW_ROUND_STATUS.CANCELLED;
		}
	}

	joinCandidate(): void {
		this._candidateJoined = true;
	}

	joinInterviewer(): void {
		this._interviewerJoined = true;
	}

	setCandidateStatus(status: CANDIDATE_INTERVIEW_STATUS): void {
		this._candidateStatus = status;
	}
}

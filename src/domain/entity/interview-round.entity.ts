export class InterviewRoundEntity {
	private readonly _id?: string;
	private _applicationId: string;
	private _interviewerId: string;
	private _templateId: string;
	private _scheduledAt: Date;
	private _status: string; // PENDING, COMPLETED, CANCELLED
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
		interviewerId: string,
		templateId: string,
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
		this._interviewerId = interviewerId;
		this._templateId = templateId;
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
	}

	static create(data: {
		applicationId: string;
		interviewerId: string;
		templateId: string;
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
			data.interviewerId,
			data.templateId,
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

	get interviewerId(): string {
		return this._interviewerId;
	}

	get templateId(): string {
		return this._templateId;
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

	complete(score: number, feedback: string, rubricRatings: Map<string, number>): void {
		this._status = "COMPLETED";
		this._score = score;
		this._feedback = feedback;
		this._rubricRatings = rubricRatings;
	}

	cancel(): void {
		this._status = "CANCELLED";
	}

	reschedule(scheduledAt: Date): void {
		this._scheduledAt = scheduledAt;
	}

	confirm(status: "CONFIRMED" | "DECLINED"): void {
		this._candidateConfirmation = status;
		if (status === "DECLINED") {
			this._status = "CANCELLED";
		}
	}

	joinCandidate(): void {
		this._candidateJoined = true;
	}

	joinInterviewer(): void {
		this._interviewerJoined = true;
	}

	setCandidateStatus(status: "PASS" | "REJECTED" | "PENDING"): void {
		this._candidateStatus = status;
	}
}

export interface PopulatedInterviewRoundDto {
	id: string;
	applicationId: string;
	interviewerIds: string[];
	interviewers: { id: string; email: string; department: string }[];
	templateId: string;
	templateName: string;
	templateDuration: number;
	templateRubric: string[];
	title: string;
	type: string;
	timeZone: string;
	duration: number;
	instructions?: string;
	internalNotes?: string;
	meetingCode: string;
	scheduledAt: Date;
	status: string;
	candidateConfirmation: string;
	candidateJoined: boolean;
	interviewerJoined: boolean;
	candidateStatus: string;
	feedback?: string;
	score?: number;
	rubricRatings?: Record<string, number>;
	createdAt?: Date;
	updatedAt?: Date;
}

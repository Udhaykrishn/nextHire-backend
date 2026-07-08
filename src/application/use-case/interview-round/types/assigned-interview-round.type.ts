export interface AssignedInterviewRoundDto {
	id: string;
	title: string;
	type: string;
	duration: number;
	meetingCode: string;
	scheduledAt: Date;
	status: string;
	feedback?: string;
	score?: number;
	rubricRatings?: Record<string, number>;
	candidate: {
		name: string;
		email: string;
		phone?: string;
		skills?: string[];
		resume?: string;
		bio?: string;
	};
	job: {
		title: string;
	};
	template: {
		name: string;
		description?: string;
		duration: number;
		rubric: string[];
	};
}

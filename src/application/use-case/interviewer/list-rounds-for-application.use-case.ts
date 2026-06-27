import { Injectable } from "@nestjs/common";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round.repository";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer.repository";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/interviewer-template.repository";

export interface PopulatedInterviewRoundDto {
	id: string;
	applicationId: string;
	interviewerId: string;
	interviewerEmail: string;
	interviewerDepartment: string;
	templateId: string;
	templateName: string;
	templateDuration: number;
	templateRubric: string[];
	scheduledAt: Date;
	status: string;
	feedback?: string;
	score?: number;
	rubricRatings?: Record<string, number>;
	createdAt?: Date;
}

@Injectable()
export class ListRoundsForApplicationUseCase {
	constructor(
		private readonly _roundRepository: InterviewRoundRepository,
		private readonly _interviewerRepository: InterviewerRepository,
		private readonly _templateRepository: InterviewerTemplateRepository,
	) {}

	async execute(applicationId: string): Promise<PopulatedInterviewRoundDto[]> {
		const rounds = await this._roundRepository.findByApplicationId(applicationId);

		const result: PopulatedInterviewRoundDto[] = [];

		for (const round of rounds) {
			const interviewer = await this._interviewerRepository.findById(round.interviewerId);
			const template = await this._templateRepository.findById(round.templateId);

			const rubricRatingsRecord: Record<string, number> = {};
			if (round.rubricRatings) {
				round.rubricRatings.forEach((val, key) => {
					rubricRatingsRecord[key] = val;
				});
			}

			result.push({
				id: round.id || "",
				applicationId: round.applicationId,
				interviewerId: round.interviewerId,
				interviewerEmail: interviewer?.email || "Unknown Interviewer",
				interviewerDepartment: interviewer?.department || "N/A",
				templateId: round.templateId,
				templateName: template?.name || "Unknown Template",
				templateDuration: template?.duration || 0,
				templateRubric: template?.rubric || [],
				scheduledAt: round.scheduledAt,
				status: round.status,
				feedback: round.feedback,
				score: round.score,
				rubricRatings: rubricRatingsRecord,
				createdAt: round.createdAt,
			});
		}

		return result;
	}
}

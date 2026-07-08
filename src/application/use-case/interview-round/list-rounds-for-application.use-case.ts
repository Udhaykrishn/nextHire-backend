import { Injectable } from "@nestjs/common";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/template/interviewer-template.repository";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { PopulatedInterviewRoundDto } from "./types/populated-interview-round.type";

@Injectable()
export class ListRoundsForApplicationUseCase implements IExecutable<string, PopulatedInterviewRoundDto[]> {
	constructor(
		private readonly _roundRepository: InterviewRoundRepository,
		private readonly _interviewerRepository: InterviewerRepository,
		private readonly _templateRepository: InterviewerTemplateRepository,
	) {}

	async execute(applicationId: string): Promise<PopulatedInterviewRoundDto[]> {
		const rounds = await this._roundRepository.findByApplicationId(applicationId);
		const result: PopulatedInterviewRoundDto[] = [];

		for (const round of rounds) {
			const interviewersData: { id: string; email: string; department: string }[] = [];
			for (const id of round.interviewerIds ?? []) {
				const interviewer = await this._interviewerRepository.findById(id);
				if (interviewer) {
					interviewersData.push({
						id: interviewer.id ?? "",
						email: interviewer.email,
						department: interviewer.department,
					});
				}
			}

			const template = await this._templateRepository.findById(round.templateId);

			const rubricRatingsRecord: Record<string, number> = {};
			if (round.rubricRatings) {
				round.rubricRatings.forEach((val, key) => {
					rubricRatingsRecord[key] = val;
				});
			}

			result.push({
				id: round.id ?? "",
				applicationId: round.applicationId,
				interviewerIds: round.interviewerIds ?? [],
				interviewers: interviewersData,
				templateId: round.templateId,
				templateName: template?.name ?? "Unknown Template",
				templateDuration: template?.duration ?? 0,
				templateRubric: template?.rubric ?? [],
				title: round.title,
				type: round.type,
				timeZone: round.timeZone,
				duration: round.duration,
				instructions: round.instructions,
				internalNotes: round.internalNotes,
				meetingCode: round.meetingCode,
				scheduledAt: round.scheduledAt,
				status: round.status,
				candidateConfirmation: round.candidateConfirmation,
				candidateJoined: round.candidateJoined,
				interviewerJoined: round.interviewerJoined,
				candidateStatus: round.candidateStatus,
				feedback: round.feedback,
				score: round.score,
				rubricRatings: rubricRatingsRecord,
				createdAt: round.createdAt,
				updatedAt: round.updatedAt,
			});
		}

		return result;
	}
}

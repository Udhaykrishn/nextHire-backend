import { Inject, Injectable } from "@nestjs/common";
import { JOB_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/template/interviewer-template.repository";
import type { JobApplicationRepository } from "@/infrastructure/db/mongodb/repository/job-application.repository";
import type { UserRepository } from "@/infrastructure/db/mongodb/repository/user.repository";
import type { JobRepository } from "@/infrastructure/db/mongodb/repository/job.repository";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { AssignedInterviewRoundDto } from "./types/assigned-interview-round.type";

@Injectable()
export class ListAssignedRoundsUseCase implements IExecutable<string, AssignedInterviewRoundDto[]> {
	constructor(
		private readonly _roundRepository: InterviewRoundRepository,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _applicationRepository: JobApplicationRepository,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: UserRepository,
		private readonly _templateRepository: InterviewerTemplateRepository,
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: JobRepository,
	) { }

	async execute(interviewerId: string): Promise<AssignedInterviewRoundDto[]> {
		const rounds = await this._roundRepository.findByInterviewerId(interviewerId);
		const result: AssignedInterviewRoundDto[] = [];

		for (const round of rounds) {
			const application = await this._applicationRepository.findById(round.applicationId);
			const template = await this._templateRepository.findById(round.templateId);

			let candidateName = "Unknown Candidate";
			let candidateEmail = "N/A";
			let candidatePhone: string | undefined;
			let candidateSkills: string[] | undefined;
			let candidateResume: string | undefined;
			let candidateBio: string | undefined;
			let jobTitle = "Unknown Job Position";

			if (application) {
				const user = await this._userRepository.findById(application.userId);
				if (user) {
					candidateName = user.name;
					candidateEmail = user.email;
					candidatePhone = user.phone;
				}

				const job = await this._jobRepository.findById(application.jobId);
				if (job) {
					jobTitle = job.jobTitle;
				}
			}

			const ratingsRecord: Record<string, number> = {};
			if (round.rubricRatings) {
				round.rubricRatings.forEach((val, key) => {
					ratingsRecord[key] = val;
				});
			}

			result.push({
				id: round.id ?? "",
				scheduledAt: round.scheduledAt,
				status: round.status,
				feedback: round.feedback,
				score: round.score,
				rubricRatings: ratingsRecord,
				candidate: {
					name: candidateName,
					email: candidateEmail,
					phone: candidatePhone,
					skills: candidateSkills,
					resume: candidateResume,
					bio: candidateBio,
				},
				job: {
					title: jobTitle,
				},
				template: {
					name: template?.name ?? "Unknown Template",
					description: template?.description,
					duration: template?.duration ?? 0,
					rubric: template?.rubric ?? [],
				},
			});
		}

		return result.sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
	}
}

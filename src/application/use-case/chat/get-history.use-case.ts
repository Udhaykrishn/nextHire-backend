import { Injectable, Inject, ForbiddenException } from "@nestjs/common";
import { CHAT_TOKEN, JOB_TOKEN } from "@/application/enums/tokens";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IChatRepository } from "@/application/interface/repository/chat-repository.interface";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import type { IRecruiterRepository } from "@/application/interface/repository";
import type { RecruiterEntity, JobApplicationEntity, JobEntity } from "@/domain/entity";
import { ChatEntity } from "@/domain/entity/chat.entity";

export interface GetChatHistoryDto {
	userId: string;
	otherUserId: string;
}

@Injectable()
export class GetHistoryUseCase implements IExecutable<GetChatHistoryDto, ChatEntity[]> {
	constructor(
		@Inject(CHAT_TOKEN.CHAT_REPOSITORY)
		private readonly chatRepository: IChatRepository,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly jobRepository: IJobRepository<JobEntity>,
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly recruiterRepository: IRecruiterRepository<RecruiterEntity>,
	) {}

	async execute(dto: GetChatHistoryDto): Promise<ChatEntity[]> {
		const userIsRecruiter = await this.recruiterRepository.findById(dto.userId);

		const candidateId = userIsRecruiter ? dto.otherUserId : dto.userId;
		const recruiterId = userIsRecruiter ? dto.userId : dto.otherUserId;

		// Verify shortlist constraint
		const apps = await this.jobApplicationRepository.findByUserId(candidateId);
		let hasShortlist = false;

		for (const app of apps) {
			if (app.status === "SHORTLISTED" || app.status === "HIRED") {
				const job = await this.jobRepository.findById(app.jobId);
				if (job && (job.posted_by === recruiterId || job.company_id === recruiterId) && job.is_chat_enabled) {
					hasShortlist = true;
					break;
				}
			}
		}

		if (!hasShortlist) {
			throw new ForbiddenException("Cannot access chat history unless candidate is shortlisted");
		}

		// Fetch messages and mark incoming ones as read
		const messages = await this.chatRepository.findHistory(dto.userId, dto.otherUserId);
		await this.chatRepository.markAsViewed(dto.otherUserId, dto.userId);

		return messages;
	}
}

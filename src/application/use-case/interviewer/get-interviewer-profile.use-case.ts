import { Injectable, NotFoundException } from "@nestjs/common";
import { InterviewerEntity } from "@/domain/entity/interviewer.entity";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer.repository";

@Injectable()
export class GetInterviewerProfileUseCase {
	constructor(private readonly _interviewerRepository: InterviewerRepository) {}

	async execute(email: string): Promise<InterviewerEntity> {
		const interviewer = await this._interviewerRepository.findByEmail(email);
		if (!interviewer) {
			throw new NotFoundException("Interviewer not found");
		}
		return interviewer;
	}
}

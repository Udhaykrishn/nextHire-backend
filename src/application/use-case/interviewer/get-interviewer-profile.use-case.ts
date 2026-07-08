import { Injectable, NotFoundException } from "@nestjs/common";
import { InterviewerEntity } from "@/domain/entity/interviewer/interviewer.entity";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class GetInterviewerProfileUseCase implements IExecutable<string, InterviewerEntity> {
	constructor(private readonly _interviewerRepository: InterviewerRepository) {}

	async execute(email: string): Promise<InterviewerEntity> {
		const interviewer = await this._interviewerRepository.findByEmail(email);
		if (!interviewer) {
			throw new NotFoundException("Interviewer not found");
		}
		return interviewer;
	}
}

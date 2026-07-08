import { Injectable } from "@nestjs/common";
import { InterviewerEntity } from "@/domain/entity/interviewer/interviewer.entity";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";

@Injectable()
export class ListInterviewersUseCase {
	constructor(private readonly _interviewerRepository: InterviewerRepository) {}

	async execute(companyId: string): Promise<InterviewerEntity[]> {
		return this._interviewerRepository.findByCompanyId(companyId);
	}
}

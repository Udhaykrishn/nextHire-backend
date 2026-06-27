import { Injectable } from "@nestjs/common";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer.repository";

@Injectable()
export class DeleteInterviewerUseCase {
	constructor(private readonly _interviewerRepository: InterviewerRepository) {}

	async execute(id: string): Promise<boolean> {
		return this._interviewerRepository.deleteById(id);
	}
}

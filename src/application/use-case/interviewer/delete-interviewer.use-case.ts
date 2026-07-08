import { Injectable, NotFoundException } from "@nestjs/common";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class DeleteInterviewerUseCase implements IExecutable<string, boolean> {
	constructor(private readonly _interviewerRepository: InterviewerRepository) {}

	async execute(id: string): Promise<boolean> {
		const existing = await this._interviewerRepository.findById(id);
		if (!existing) {
			throw new NotFoundException("Interviewer not found");
		}
		return this._interviewerRepository.deleteById(id);
	}
}

import { Injectable } from "@nestjs/common";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/interviewer-template.repository";

@Injectable()
export class DeleteTemplateUseCase {
	constructor(private readonly _templateRepository: InterviewerTemplateRepository) {}

	async execute(id: string): Promise<boolean> {
		return this._templateRepository.deleteById(id);
	}
}

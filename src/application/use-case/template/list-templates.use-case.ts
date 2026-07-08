import { Injectable } from "@nestjs/common";
import { InterviewerTemplateEntity } from "@/domain/entity/template/interviewer-template.entity";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/template/interviewer-template.repository";

@Injectable()
export class ListTemplatesUseCase {
	constructor(private readonly _templateRepository: InterviewerTemplateRepository) {}

	async execute(companyId: string): Promise<InterviewerTemplateEntity[]> {
		return this._templateRepository.findByCompanyId(companyId);
	}
}

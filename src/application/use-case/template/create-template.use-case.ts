import { Injectable, BadRequestException } from "@nestjs/common";
import { InterviewerTemplateEntity } from "@/domain/entity/template/interviewer-template.entity";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/template/interviewer-template.repository";

import { CreateTemplateDto } from "@/application/dto/template/template.dto";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class CreateTemplateUseCase implements IExecutable<CreateTemplateDto, InterviewerTemplateEntity> {
	constructor(private readonly _templateRepository: InterviewerTemplateRepository) {}

	async execute(dto: CreateTemplateDto): Promise<InterviewerTemplateEntity> {
		const template = InterviewerTemplateEntity.create({
			companyId: dto.companyId as string,
			name: dto.name,
			description: dto.description,
			duration: dto.duration,
			rubric: dto.rubric,
		});

		return this._templateRepository.save(template);
	}
}

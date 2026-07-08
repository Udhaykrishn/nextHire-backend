import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InterviewerTemplateEntity } from "@/domain/entity/template/interviewer-template.entity";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/template/interviewer-template.repository";

import { UpdateTemplateDto } from "@/application/dto/template/template.dto";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class UpdateTemplateUseCase implements IExecutable<UpdateTemplateDto, InterviewerTemplateEntity> {
	constructor(private readonly _templateRepository: InterviewerTemplateRepository) {}

	async execute(dto: UpdateTemplateDto): Promise<InterviewerTemplateEntity> {
		const template = await this._templateRepository.findById(dto.templateId as string);
		if (!template || template.companyId !== dto.companyId) {
			throw new NotFoundException("Template not found");
		}

		const updatedTemplate = InterviewerTemplateEntity.create({
			id: template.id,
			companyId: template.companyId,
			name: dto.name || template.name,
			description: dto.description !== undefined ? dto.description : template.description,
			duration: dto.duration || template.duration,
			rubric: dto.rubric || template.rubric,
			defaultType: dto.defaultType || template.defaultType,
			defaultInstructions:
				dto.defaultInstructions !== undefined ? dto.defaultInstructions : template.defaultInstructions,
			createdAt: template.createdAt,
			updatedAt: new Date(),
		});

		return this._templateRepository.save(updatedTemplate);
	}
}

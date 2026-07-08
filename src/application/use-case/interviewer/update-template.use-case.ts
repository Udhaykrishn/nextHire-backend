import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InterviewerTemplateEntity } from "@/domain/entity/interviewer-template.entity";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/interviewer-template.repository";

export interface UpdateTemplateDto {
	templateId: string;
	companyId: string;
	name?: string;
	description?: string;
	duration?: number;
	rubric?: string[];
	defaultType?: string;
	defaultInstructions?: string;
}

@Injectable()
export class UpdateTemplateUseCase {
	constructor(private readonly _templateRepository: InterviewerTemplateRepository) {}

	async execute(dto: UpdateTemplateDto): Promise<InterviewerTemplateEntity> {
		if (!dto.templateId) {
			throw new BadRequestException("Template ID is required");
		}
		if (!dto.companyId) {
			throw new BadRequestException("Company ID is required");
		}

		const template = await this._templateRepository.findById(dto.templateId);
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

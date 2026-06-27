import { Injectable, BadRequestException } from "@nestjs/common";
import { InterviewerTemplateEntity } from "@/domain/entity/interviewer-template.entity";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/interviewer-template.repository";

export interface CreateTemplateDto {
	companyId: string;
	name: string;
	description?: string;
	duration: number;
	rubric: string[];
}

@Injectable()
export class CreateTemplateUseCase {
	constructor(private readonly _templateRepository: InterviewerTemplateRepository) {}

	async execute(dto: CreateTemplateDto): Promise<InterviewerTemplateEntity> {
		if (!dto.name) {
			throw new BadRequestException("Template name is required");
		}
		if (dto.duration <= 0) {
			throw new BadRequestException("Duration must be greater than zero");
		}
		if (!dto.rubric || dto.rubric.length === 0) {
			throw new BadRequestException("At least one rubric criterion is required");
		}

		const template = InterviewerTemplateEntity.create({
			companyId: dto.companyId,
			name: dto.name,
			description: dto.description,
			duration: dto.duration,
			rubric: dto.rubric,
		});

		return this._templateRepository.save(template);
	}
}

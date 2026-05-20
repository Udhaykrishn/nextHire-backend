import type { CreateProjectDto } from "@/application/dto/project/create-project.dto";
import type { ResponseProjectDto } from "@/application/dto/project/response-project.dto";
import { PROJECT_TOKEN } from "@/application/enums/tokens/project-token.enum";
import { PROJECT_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IProjectRepository } from "@/application/interface/repository/project-repository.interface";
import type { IProjectApplicationMapper } from "@/application/interface/mappers/project/project-application-mapper.interface";
import { ProjectEntity } from "@/domain/entity/project.entity";
import { ProjectType } from "@/infrastructure/db/mongodb/models/project.schema";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PLAN_LIMITS } from "@/domain/constants";

@Injectable()
export class CreateProjectUseCase implements IExecutable<CreateProjectDto, ResponseProjectDto> {
	constructor(
		@Inject(PROJECT_TOKEN.PROJECT_REPOSITORY)
		private readonly _projectRepository: IProjectRepository<ProjectEntity>,
		@Inject(PROJECT_MAPPER.PROJECT_APPLICATION)
		private readonly _mapper: IProjectApplicationMapper<ProjectType>,
	) {}

	async execute(data: CreateProjectDto): Promise<ResponseProjectDto> {
		const currentProjects = await this._projectRepository.findByUserId(data.userId!);
		if (currentProjects.length >= PLAN_LIMITS.FREE.MAX_PROJECTS) {
			throw new BadRequestException(USER_PROFILE_MESSAGES.PROJECT_LIMIT_REACHED);
		}

		const project = ProjectEntity.create({
			userId: data.userId!,
			projectName: data.projectName,
			description: data.description,
			startDate: data.startDate,
			endDate: data.endDate,
			url: data.url,
			company: data.company,
			location: data.location,
			industry: data.industry,
			role: data.role,
			currentlyWorking: data.currentlyWorking,
			employmentType: data.employmentType,
			noticePeriod: data.noticePeriod,
		});

		const savedProject = await this._projectRepository.save(project);

		return this._mapper.toResponse(savedProject);
	}
}

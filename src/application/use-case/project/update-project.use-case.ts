import type { UpdateProjectDto } from "@/application/dto/project/update-project.dto";
import type { ResponseProjectDto } from "@/application/dto/project/response-project.dto";
import { PROJECT_TOKEN } from "@/application/enums/tokens/project-token.enum";
import { PROJECT_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IProjectRepository } from "@/application/interface/repository/project-repository.interface";
import type { IProjectApplicationMapper } from "@/application/interface/mappers/project/project-application-mapper.interface";
import type { ProjectEntity } from "@/domain/entity/project.entity";
import type { ProjectType } from "@/infrastructure/db/mongodb/models/project.schema";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UpdateProjectUseCase implements IExecutable<UpdateProjectDto, ResponseProjectDto> {
	constructor(
		@Inject(PROJECT_TOKEN.PROJECT_REPOSITORY)
		private readonly _projectRepository: IProjectRepository<ProjectEntity>,
		@Inject(PROJECT_MAPPER.PROJECT_APPLICATION)
		private readonly _mapper: IProjectApplicationMapper<ProjectType>,
	) {}

	async execute(data: UpdateProjectDto): Promise<ResponseProjectDto> {
		const project = await this._projectRepository.findById(data.id);
		if (!project) {
			throw new NotFoundException(USER_PROFILE_MESSAGES.PROJECT_NOT_FOUND);
		}

		if (data.projectName) project.changeProjectName(data.projectName);
		if (data.description) project.changeDescription(data.description);
		if (data.startDate) project.changeStartDate(data.startDate);
		if (data.endDate) project.changeEndDate(data.endDate);
		if (data.url) project.changeUrl(data.url);

		const updatedProject = await this._projectRepository.findByIdAndUpdate(project.id!, project);

		if (!updatedProject) {
			throw new BadRequestException("Project not found");
		}

		return this._mapper.toResponse(updatedProject);
	}
}

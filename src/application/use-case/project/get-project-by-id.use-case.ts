import type { ResponseProjectDto } from "@/application/dto/project/response-project.dto";
import { PROJECT_TOKEN } from "@/application/enums/tokens/project-token.enum";
import { PROJECT_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IProjectRepository } from "@/application/interface/repository/project-repository.interface";
import type { IProjectApplicationMapper } from "@/application/interface/mappers/project/project-application-mapper.interface";
import type { ProjectEntity } from "@/domain/entity/project.entity";
import type { ProjectType } from "@/infrastructure/db/mongodb/models/project.schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetProjectByIdUseCase implements IExecutable<string, ResponseProjectDto> {
	constructor(
		@Inject(PROJECT_TOKEN.PROJECT_REPOSITORY)
		private readonly _projectRepository: IProjectRepository<ProjectEntity>,
		@Inject(PROJECT_MAPPER.PROJECT_APPLICATION)
		private readonly _mapper: IProjectApplicationMapper<ProjectType>,
	) {}

	async execute(id: string): Promise<ResponseProjectDto> {
		const project = await this._projectRepository.findById(id);
		if (!project) {
			throw new NotFoundException(`Project with ID ${id} not found`);
		}
		return this._mapper.toResponse(project);
	}
}

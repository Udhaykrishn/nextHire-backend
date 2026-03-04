import type { ResponseProjectDto } from "@/application/dto/project/response-project.dto";
import { PROJECT_TOKEN } from "@/application/enums/tokens/project-token.enum";
import { PROJECT_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IProjectRepository } from "@/application/interface/repository/project-repository.interface";
import type { IProjectApplicationMapper } from "@/application/interface/mappers/project/project-application-mapper.interface";
import type { ProjectEntity } from "@/domain/entity/project.entity";
import type { ProjectType } from "@/infrastructure/db/mongodb/models/project.schema";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetProjectsUseCase implements IExecutable<string, ResponseProjectDto[]> {
	constructor(
		@Inject(PROJECT_TOKEN.PROJECT_REPOSITORY)
		private readonly _projectRepository: IProjectRepository<ProjectEntity>,
		@Inject(PROJECT_MAPPER.PROJECT_APPLICATION)
		private readonly _mapper: IProjectApplicationMapper<ProjectType>,
	) {}

	async execute(userId: string): Promise<ResponseProjectDto[]> {
		const projects = await this._projectRepository.findByUserId(userId);
		if (!projects || projects.length === 0) return [];
		return projects.map((proj) => this._mapper.toResponse(proj));
	}
}

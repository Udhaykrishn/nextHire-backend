import { PROJECT_TOKEN } from "@/application/enums/tokens/project-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IProjectRepository } from "@/application/interface/repository/project-repository.interface";
import type { ProjectEntity } from "@/domain/entity/project.entity";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class DeleteProjectUseCase implements IExecutable<string, void> {
	constructor(
		@Inject(PROJECT_TOKEN.PROJECT_REPOSITORY)
		private readonly _projectRepository: IProjectRepository<ProjectEntity>,
	) {}

	async execute(id: string): Promise<void> {
		const success = await this._projectRepository.deleteById(id);
		if (!success) {
			throw new NotFoundException(USER_PROFILE_MESSAGES.PROJECT_NOT_FOUND);
		}
	}
}

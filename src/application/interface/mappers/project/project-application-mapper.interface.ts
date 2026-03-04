import type { ResponseProjectDto } from "@/application/dto/project/response-project.dto";
import type { ProjectEntity } from "@/domain/entity/project.entity";

export interface IProjectApplicationMapper<T> {
	toResponse(data: ProjectEntity): ResponseProjectDto;
	toDomain(data: T): ProjectEntity;
}

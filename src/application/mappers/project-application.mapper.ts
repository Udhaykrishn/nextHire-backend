import { ProjectEntity } from "@/domain/entity/project.entity";
import type { ResponseProjectDto } from "@/application/dto/project/response-project.dto";
import type { IProjectApplicationMapper } from "@/application/interface/mappers/project/project-application-mapper.interface";
import type { ProjectType } from "@/infrastructure/db/mongodb/models/project.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectApplicationMapper implements IProjectApplicationMapper<ProjectType> {
	toResponse(project: ProjectEntity): ResponseProjectDto {
		return {
			id: project.id as string,
			userId: project.userId,
			projectName: project.projectName,
			description: project.description,
			startDate: project.startDate,
			endDate: project.endDate,
			url: project.url,
			createdAt: project.createdAt,
		};
	}

	toDomain(data: ProjectType): ProjectEntity {
		return ProjectEntity.create({
			id: data._id?.toString(),
			userId: data.userId,
			projectName: data.projectName,
			description: data.description,
			startDate: data.startDate,
			endDate: data.endDate,
			url: data.url,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}
}

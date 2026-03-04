import { ProjectEntity } from "@/domain/entity/project.entity";
import type { IProjectPresistanceMapper } from "@/application/interface/mappers/project/project-presistance.mapper";
import type { ProjectType } from "../db/mongodb/models/project.schema";

export class ProjectPresistanceMapper implements IProjectPresistanceMapper<ProjectEntity, ProjectType> {
	toMongo(entity: ProjectEntity): ProjectType {
		return {
			_id: entity.id as string,
			userId: entity.userId,
			projectName: entity.projectName,
			description: entity.description,
			startDate: entity.startDate,
			endDate: entity.endDate,
			url: entity.url,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	async fromMongo(doc: ProjectType): Promise<ProjectEntity> {
		return ProjectEntity.create({
			id: doc._id.toString(),
			userId: doc.userId,
			projectName: doc.projectName,
			description: doc.description,
			startDate: doc.startDate,
			endDate: doc.endDate,
			url: doc.url,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

import { EducationEntity } from "@/domain/entity/education.entity";
import type { IEducationPresistanceMapper } from "@/application/interface/mappers/education/education-presistance.mapper";
import type { EducationType } from "../db/mongodb/models/education.schema";

export class EducationPresistanceMapper implements IEducationPresistanceMapper<EducationEntity, EducationType> {
	toMongo(entity: EducationEntity): EducationType {
		return {
			_id: entity.id as string,
			userId: entity.userId,
			institutionName: entity.institutionName,
			degree: entity.degree,
			fieldOfStudy: entity.fieldOfStudy,
			startDate: entity.startDate,
			endDate: entity.endDate,
			gpa: entity.gpa,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	async fromMongo(doc: EducationType): Promise<EducationEntity> {
		return EducationEntity.create({
			id: doc._id.toString(),
			userId: doc.userId,
			institutionName: doc.institutionName,
			degree: doc.degree,
			fieldOfStudy: doc.fieldOfStudy,
			startDate: doc.startDate,
			endDate: doc.endDate,
			gpa: doc.gpa,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

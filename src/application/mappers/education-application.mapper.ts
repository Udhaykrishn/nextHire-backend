import { EducationEntity } from "@/domain/entity/education.entity";
import type { ResponseEducationDto } from "@/application/dto/education/response-education.dto";
import type { IEducationApplicationMapper } from "@/application/interface/mappers/education/education-application-mapper.interface";
import type { EducationType } from "@/infrastructure/db/mongodb/models/education.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class EducationApplicationMapper implements IEducationApplicationMapper<EducationType> {
	toResponse(education: EducationEntity): ResponseEducationDto {
		return {
			id: education.id as string,
			userId: education.userId,
			institutionName: education.institutionName,
			degree: education.degree,
			fieldOfStudy: education.fieldOfStudy,
			startDate: education.startDate,
			endDate: education.endDate,
			gpa: education.gpa,
			createdAt: education.createdAt,
		};
	}

	toDomain(data: EducationType): EducationEntity {
		return EducationEntity.create({
			id: data._id?.toString(),
			userId: data.userId,
			institutionName: data.institutionName,
			degree: data.degree,
			fieldOfStudy: data.fieldOfStudy,
			startDate: data.startDate,
			endDate: data.endDate,
			gpa: data.gpa,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}
}

import type { ResponseEducationDto } from "@/application/dto/education/response-education.dto";
import type { EducationEntity } from "@/domain/entity/education.entity";

export interface IEducationApplicationMapper<T> {
	toResponse(data: EducationEntity): ResponseEducationDto;
	toDomain(data: T): EducationEntity;
}

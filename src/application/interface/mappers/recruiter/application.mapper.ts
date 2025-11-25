import { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { RecruiterEntity } from "@/domain/entity";

export interface IRecruiterApplicationMappers<T> {
	toResponse(user: RecruiterEntity): ResponseRecruiterDto;
	toDomain(data: T): RecruiterEntity;
}

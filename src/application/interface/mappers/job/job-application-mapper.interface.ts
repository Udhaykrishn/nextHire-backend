import type { ResponseJobDto } from "@/application/dto/job/response-job.dto";
import type { JobEntity } from "@/domain/entity/job.entity";

export interface IJobApplicationMapper<T> {
	toResponse(data: JobEntity): ResponseJobDto;
	toDomain(data: T): JobEntity;
}

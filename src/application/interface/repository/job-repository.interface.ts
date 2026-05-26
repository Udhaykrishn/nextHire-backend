import type { PaginationResponse } from "@/domain/types/paginations";
import type { PaginationDto } from "@/application/dto/pagiation";
import type { IBaseRepository } from "./base-repository.interface";

export interface IJobRepository<T> extends IBaseRepository<T> {
	findByRecruiterId(recruiterId: string): Promise<T[]>;
	findAllJobs(pages: PaginationDto): Promise<PaginationResponse<T> | null>;
	findUnpaginatedJobs(pages: PaginationDto): Promise<T[]>;
}

import type { PaginationResponse } from "@/domain/types/paginations";
import type { PaginationDto } from "@/application/dto/pagiation";
import type { IBaseRepository } from "./base-repository.interface";

export interface IJobRepository<T> extends IBaseRepository<T> {
	findByRecruiterId(
		recruiterId: string,
		page?: number,
		limit?: number,
	): Promise<{ data: T[]; total: number; page: number; limit: number; totalPages: number }>;
	findAllJobs(pages: PaginationDto): Promise<PaginationResponse<T> | null>;
	findUnpaginatedJobs(pages: PaginationDto): Promise<T[]>;
}

import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import type { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { PaginationResponse } from "@/domain/types/paginations";

export interface IJobController {
	create(req: AuthenticatedRequest, dto: CreateJobDto): Promise<Record<string, unknown>>;
	apply(req: AuthenticatedRequest, jobId: string): Promise<JobApplicationEntity>;
	getRecruiterJobs(req: AuthenticatedRequest): Promise<Record<string, unknown>[]>;
	getAllJobs(
		search?: string,
		page?: string,
		limit?: string,
		status?: string,
	): Promise<PaginationResponse<Record<string, unknown>> | null>;
	blockUnblockJob(jobId: string): Promise<Record<string, unknown>>;
	getJobsForCandidate(
		req: AuthenticatedRequest,
		search?: string,
		page?: string,
		limit?: string,
		location?: string,
		experience?: string | string[],
		salary?: string | string[],
		jobTypes?: string | string[],
	): Promise<PaginationResponse<Record<string, unknown>> | null>;
	getJobById(req: AuthenticatedRequest, jobId: string): Promise<Record<string, unknown> | null>;
}

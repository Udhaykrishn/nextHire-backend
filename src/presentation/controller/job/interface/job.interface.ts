import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import type { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { JobEntity } from "@/domain/entity/job.entity";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { PaginationResponse } from "@/domain/types/paginations";

export interface IJobController {
	create(req: AuthenticatedRequest, dto: CreateJobDto): Promise<JobEntity>;
	apply(req: AuthenticatedRequest, jobId: string): Promise<JobApplicationEntity>;
	getRecruiterJobs(req: AuthenticatedRequest): Promise<JobEntity[]>;
	getAllJobs(
		search?: string,
		page?: number,
		limit?: number,
		status?: string,
	): Promise<PaginationResponse<JobEntity> | null>;
	blockUnblockJob(jobId: string): Promise<JobEntity>;
	getJobsForCandidate(
		req: AuthenticatedRequest,
		search?: string,
		page?: number,
		limit?: number,
	): Promise<PaginationResponse<JobEntity & { matchScore?: number }> | null>;
	getJobById(req: AuthenticatedRequest, jobId: string): Promise<(JobEntity & { matchScore?: number }) | null>;
}

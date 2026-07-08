import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import type { CreateJobDto } from "@/application/dto/job/create-job.dto";
import type { UpdateJobDto } from "@/application/dto/job/update-job.dto";
import type { UpdateApplicationStatusDto } from "@/application/dto/job/update-application-status.dto";
import type { ResponseJobDto } from "@/application/dto/job/response-job.dto";
import type { JobApplicationResponse } from "@/application/use-case/job/get-job-applications.use-case";
import type { JobStatsResponse } from "@/application/use-case/job/get-job-stats.use-case";
import type { PaginationResponse } from "@/domain/types/paginations";

export interface IJobController {
	create(req: AuthenticatedRequest, dto: CreateJobDto): Promise<ResponseJobDto>;
	apply(req: AuthenticatedRequest, jobId: string): Promise<JobApplicationResponse>;
	getRecruiterJobs(
		req: AuthenticatedRequest,
		page?: string,
		limit?: string,
	): Promise<PaginationResponse<ResponseJobDto>>;
	getJobsByRecruiterId(
		recruiterId: string,
		page?: string,
		limit?: string,
	): Promise<PaginationResponse<ResponseJobDto>>;
	getAllJobs(
		search?: string,
		page?: string,
		limit?: string,
		status?: string,
	): Promise<PaginationResponse<ResponseJobDto> | null>;
	blockUnblockJob(jobId: string): Promise<ResponseJobDto>;
	getCandidateMatchScore(
		jobId: string,
		candidateId: string,
		retry?: string,
	): Promise<{ matchScore: number; breakdown: Record<string, unknown> }>;
	updateJob(jobId: string, dto: UpdateJobDto): Promise<ResponseJobDto>;
	getJobsForCandidate(
		req: AuthenticatedRequest,
		search?: string,
		page?: string,
		limit?: string,
		location?: string,
		experience?: string | string[],
		salary?: string | string[],
		jobTypes?: string | string[],
	): Promise<PaginationResponse<ResponseJobDto & { matchScore?: number }> | null>;
	getCandidateApplications(
		req: AuthenticatedRequest,
		search?: string,
		status?: string,
	): Promise<{
		data: { application: Record<string, unknown>; job: ResponseJobDto }[];
		stats: Record<string, unknown>;
	}>;
	getJobStats(jobId: string): Promise<JobStatsResponse>;
	getJobApplications(
		jobId: string,
		page?: string,
		limit?: string,
		search?: string,
		status?: string,
	): Promise<PaginationResponse<JobApplicationResponse>>;
	updateApplicationStatus(
		req: AuthenticatedRequest,
		applicationId: string,
		dto: UpdateApplicationStatusDto,
	): Promise<void>;
	getJobById(req: AuthenticatedRequest, jobId: string): Promise<(ResponseJobDto & { matchScore?: number }) | null>;
}

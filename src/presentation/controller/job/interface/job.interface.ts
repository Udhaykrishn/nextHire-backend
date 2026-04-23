import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import type { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { JobEntity } from "@/domain/entity/job.entity";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";

export interface IJobController {
	create(req: AuthenticatedRequest, dto: CreateJobDto): Promise<JobEntity>;
	apply(req: AuthenticatedRequest, jobId: string): Promise<JobApplicationEntity>;
}

import { Inject, Injectable } from "@nestjs/common";
import { JOB_TOKEN } from "@/application/enums/tokens";
import type { IJobApplicationRepository, JobApplicationReadModel } from "@/application/interface/repository/job-application-repository.interface";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { PaginationResponse } from "@/domain/types/paginations";
import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";

export type JobApplicationResponse = JobApplicationReadModel;

export interface GetJobApplicationsDto {
	jobId: string;
	page: number;
	limit: number;
	search?: string;
	status?: string;
}

@Injectable()
export class GetJobApplicationsUseCase implements IExecutable<GetJobApplicationsDto, PaginationResponse<JobApplicationResponse>> {
	constructor(
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) { }

	async execute({ jobId, page, limit, search, status }: GetJobApplicationsDto): Promise<PaginationResponse<JobApplicationResponse>> {
		const { data, total } = await this._jobApplicationRepository.findApplicationsWithCandidateDetails(jobId, page, limit, search, status);
		
		const updatedData = await Promise.all(
			data.map(async (app) => {
				if (app.candidate.resumeKey) {
					try {
						app.candidate.resume = await this._s3Service.getSignedUrlForRead(app.candidate.resumeKey);
					} catch (err) {
						console.error("Failed to sign resume URL", err);
					}
				}
				if (app.candidate.profileImageKey) {
					try {
						app.candidate.profileImage = await this._s3Service.getSignedUrlForRead(app.candidate.profileImageKey);
					} catch (err) {
						console.error("Failed to sign profile image URL", err);
					}
				}
				return app;
			})
		);

		return { data: updatedData, total, page };
	}
}

import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { JobEntity } from "@/domain/entity/job.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import { Inject, Injectable } from "@nestjs/common";
import type { PaginationDto } from "@/application/dto/pagiation";
import type { PaginationResponse } from "@/domain/types/paginations";

@Injectable()
export class GetAllJobsUseCase implements IExecutable<PaginationDto, PaginationResponse<JobEntity> | null> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
	) {}

	async execute(dto: PaginationDto): Promise<PaginationResponse<JobEntity> | null> {
		return this._jobRepository.findAllJobs(dto);
	}
}

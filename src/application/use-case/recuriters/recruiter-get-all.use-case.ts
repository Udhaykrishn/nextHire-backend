import type { PaginationDto } from "@/application/dto/pagiation";
import { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { RECRUITER_MAPPER, RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import type { PaginationResponse } from "@/domain/types/paginations";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetAllRecruitersUseCase implements IExecutable<PaginationDto, PaginationResponse<ResponseRecruiterDto>> {
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _mapper: IRecruiterApplicationMappers<RecruiterEntity>,

		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
	) {}

	async execute(paginationDto: PaginationDto): Promise<PaginationResponse<ResponseRecruiterDto>> {
		const recruiters = await this._recruiterRepository.findAllRecruiters(paginationDto);

		if (!recruiters || recruiters.data.length === 0) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		const mappedRecruiters = recruiters.data.map((recruiter) => this._mapper.toResponse(recruiter));

		return {
			data: mappedRecruiters,
			page: recruiters.page,
			total: recruiters.total,
		};
	}
}

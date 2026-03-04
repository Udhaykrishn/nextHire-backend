import type { PaginationDto } from "@/application/dto/pagiation";
import { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { RECRUITER_MAPPER } from "@/application/enums";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import type { PaginationResponse } from "@/domain/types/paginations";
import { Inject, Injectable } from "@nestjs/common";

import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";

@Injectable()
export class GetAllRecruitersUseCase implements IExecutable<PaginationDto, PaginationResponse<ResponseRecruiterDto>> {
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _mapper: IRecruiterApplicationMappers<RecruiterEntity>,

		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,

		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) {}

	async execute(
		paginationDto: PaginationDto & { status?: string },
	): Promise<PaginationResponse<ResponseRecruiterDto>> {
		const recruiters = await this._recruiterRepository.findAllRecruiters(paginationDto);

		if (!recruiters || recruiters.data.length === 0) {
			return {
				data: [],
				page: 0,
				total: 0,
			};
		}

		// Sign URLs
		await Promise.all(
			recruiters.data.map(async (recruiter) => {
				if (recruiter.profile_url && recruiter.profile_url.key) {
					try {
						const signedUrl = await this._s3Service.getSignedUrlForRead(recruiter.profile_url.key);
						recruiter.changeProfileUrl(recruiter.profile_url.key, signedUrl);
					} catch (error) {
						console.error("Error signing URL:", error);
					}
				}
			}),
		);
		// ... (hold on allow me to fix RecruiterEntity first)

		const mappedRecruiters = await Promise.all(
			recruiters.data.map((recruiter) => this._mapper.toResponse(recruiter)),
		);

		return {
			data: mappedRecruiters,
			page: recruiters.page,
			total: recruiters.total,
		};
	}
}

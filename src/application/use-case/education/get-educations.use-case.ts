import type { ResponseEducationDto } from "@/application/dto/education/response-education.dto";
import { EDUCATION_TOKEN } from "@/application/enums/tokens/education-token.enum";
import { EDUCATION_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IEducationRepository } from "@/application/interface/repository/education-repository.interface";
import type { IEducationApplicationMapper } from "@/application/interface/mappers/education/education-application-mapper.interface";
import type { EducationEntity } from "@/domain/entity/education.entity";
import type { EducationType } from "@/infrastructure/db/mongodb/models/education.schema";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetEducationsUseCase implements IExecutable<string, ResponseEducationDto[]> {
	constructor(
		@Inject(EDUCATION_TOKEN.EDUCATION_REPOSITORY)
		private readonly _educationRepository: IEducationRepository<EducationEntity>,
		@Inject(EDUCATION_MAPPER.EDUCATION_APPLICATION)
		private readonly _mapper: IEducationApplicationMapper<EducationType>,
	) {}

	async execute(userId: string): Promise<ResponseEducationDto[]> {
		const educations = await this._educationRepository.findByUserId(userId);
		if (!educations || educations.length === 0) return [];
		return educations.map((edu) => this._mapper.toResponse(edu));
	}
}

import type { CreateEducationDto } from "@/application/dto/education/create-education.dto";
import type { ResponseEducationDto } from "@/application/dto/education/response-education.dto";
import { EDUCATION_TOKEN } from "@/application/enums/tokens/education-token.enum";
import { EDUCATION_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IEducationRepository } from "@/application/interface/repository/education-repository.interface";
import type { IEducationApplicationMapper } from "@/application/interface/mappers/education/education-application-mapper.interface";
import { EducationEntity } from "@/domain/entity/education.entity";
import { EducationType } from "@/infrastructure/db/mongodb/models/education.schema";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { PLAN_LIMITS } from "@/domain/constants";

@Injectable()
export class CreateEducationUseCase implements IExecutable<CreateEducationDto, ResponseEducationDto> {
	constructor(
		@Inject(EDUCATION_TOKEN.EDUCATION_REPOSITORY)
		private readonly _educationRepository: IEducationRepository<EducationEntity>,
		@Inject(EDUCATION_MAPPER.EDUCATION_APPLICATION)
		private readonly _mapper: IEducationApplicationMapper<EducationType>,
	) {}

	async execute(data: CreateEducationDto): Promise<ResponseEducationDto> {
		const currentEducation = await this._educationRepository.findByUserId(data.userId);
		if (currentEducation.length >= PLAN_LIMITS.FREE.MAX_EDUCATION) {
			throw new BadRequestException(USER_PROFILE_MESSAGES.EDUCATION_LIMIT_REACHED);
		}

		const education = EducationEntity.create({
			userId: data.userId,
			institutionName: data.institutionName,
			degree: data.degree,
			fieldOfStudy: data.fieldOfStudy,
			startDate: data.startDate,
			endDate: data.endDate,
			gpa: data.gpa,
		});

		const savedEducation = await this._educationRepository.save(education);

		return this._mapper.toResponse(savedEducation);
	}
}

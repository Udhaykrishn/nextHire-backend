import type { UpdateEducationDto } from "@/application/dto/education/update-education.dto";
import type { ResponseEducationDto } from "@/application/dto/education/response-education.dto";
import { EDUCATION_TOKEN } from "@/application/enums/tokens/education-token.enum";
import { EDUCATION_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IEducationRepository } from "@/application/interface/repository/education-repository.interface";
import type { IEducationApplicationMapper } from "@/application/interface/mappers/education/education-application-mapper.interface";
import type { EducationEntity } from "@/domain/entity/education.entity";
import type { EducationType } from "@/infrastructure/db/mongodb/models/education.schema";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UpdateEducationUseCase implements IExecutable<UpdateEducationDto, ResponseEducationDto> {
	constructor(
		@Inject(EDUCATION_TOKEN.EDUCATION_REPOSITORY)
		private readonly _educationRepository: IEducationRepository<EducationEntity>,
		@Inject(EDUCATION_MAPPER.EDUCATION_APPLICATION)
		private readonly _mapper: IEducationApplicationMapper<EducationType>,
	) {}

	async execute(data: UpdateEducationDto): Promise<ResponseEducationDto> {
		const education = await this._educationRepository.findById(data.id);
		if (!education) {
			throw new NotFoundException(USER_PROFILE_MESSAGES.EDUCATION_NOT_FOUND);
		}

		if (data.institutionName) education.changeInstitutionName(data.institutionName);
		if (data.degree) education.changeDegree(data.degree);
		if (data.fieldOfStudy) education.changeFieldOfStudy(data.fieldOfStudy);
		if (data.startDate) education.changeStartDate(data.startDate);
		if (data.endDate) education.changeEndDate(data.endDate);
		if (data.gpa) education.changeGpa(data.gpa);

		const updatedEducation = await this._educationRepository.findByIdAndUpdate(education.id!, education);

		return this._mapper.toResponse(updatedEducation!);
	}
}

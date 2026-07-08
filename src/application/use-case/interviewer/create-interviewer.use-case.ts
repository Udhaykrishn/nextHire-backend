import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { InterviewerEntity } from "@/domain/entity/interviewer/interviewer.entity";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IPasswordHash } from "@/infrastructure/services/interface";
import { USER_ROLE } from "@/domain/enums";

import { CreateInterviewerDto } from "@/application/dto/interviewer/create-interviewer.dto";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class CreateInterviewerUseCase implements IExecutable<CreateInterviewerDto, InterviewerEntity> {
	constructor(
		private readonly _interviewerRepository: InterviewerRepository,
		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHasher: IPasswordHash,
	) { }

	async execute(dto: CreateInterviewerDto): Promise<InterviewerEntity> {
		const existing = await this._interviewerRepository.findByEmail(dto.email);
		if (existing) {
			throw new BadRequestException("Interviewer with this email already exists");
		}

		const rawPassword = dto.password as string;
		const hashedPassword = await this._passwordHasher.hash(rawPassword);

		const interviewer = InterviewerEntity.create({
			email: dto.email,
			companyId: dto.companyId as string,
			createdBy: dto.createdBy as string,
			role: USER_ROLE.INTERVIEWER,
			password: hashedPassword,
			department: dto.department,
		});

		return this._interviewerRepository.save(interviewer);
	}
}

import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { InterviewerEntity } from "@/domain/entity/interviewer.entity";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer.repository";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IPasswordHash } from "@/infrastructure/services/interface";
import { USER_ROLE } from "@/domain/enums";

export interface CreateInterviewerDto {
	email: string;
	companyId: string;
	createdBy: string;
	password?: string;
	department: string;
}

@Injectable()
export class CreateInterviewerUseCase {
	constructor(
		private readonly _interviewerRepository: InterviewerRepository,
		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHasher: IPasswordHash,
	) {}

	async execute(dto: CreateInterviewerDto): Promise<InterviewerEntity> {
		const existing = await this._interviewerRepository.findByEmail(dto.email);
		if (existing) {
			throw new BadRequestException("Interviewer with this email already exists");
		}

		// Use default password or generate one if not provided
		const rawPassword = dto.password || "Interviewer@123";
		const hashedPassword = await this._passwordHasher.hash(rawPassword);

		const interviewer = InterviewerEntity.create({
			email: dto.email,
			companyId: dto.companyId,
			createdBy: dto.createdBy,
			role: USER_ROLE.INTERVIEWER,
			password: hashedPassword,
			department: dto.department,
		});

		return this._interviewerRepository.save(interviewer);
	}
}

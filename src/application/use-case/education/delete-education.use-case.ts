import { EDUCATION_TOKEN } from "@/application/enums/tokens/education-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IEducationRepository } from "@/application/interface/repository/education-repository.interface";
import type { EducationEntity } from "@/domain/entity/education.entity";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class DeleteEducationUseCase implements IExecutable<string, void> {
	constructor(
		@Inject(EDUCATION_TOKEN.EDUCATION_REPOSITORY)
		private readonly _educationRepository: IEducationRepository<EducationEntity>,
	) {}

	async execute(id: string): Promise<void> {
		const success = await this._educationRepository.deleteById(id);
		if (!success) {
			throw new NotFoundException(USER_PROFILE_MESSAGES.EDUCATION_NOT_FOUND);
		}
	}
}

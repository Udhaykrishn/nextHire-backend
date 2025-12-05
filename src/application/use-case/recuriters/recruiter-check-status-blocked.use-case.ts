import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { AccountBlockedException } from "@/domain/exceptions/account-blocked.exception";
import { RecruiterEntity } from "@/domain/entity";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { RECRUITER_STATUS } from "@/domain/enums/status";
import { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class CheckRecruiterBlockedUseCase implements IExecutable<string, void> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly recruiterRepository: IRecruiterRepository<RecruiterEntity>,
	) {}

	async execute(userId: string): Promise<void> {
		const user = await this.recruiterRepository.findById(userId);

		if (!user) {
			throw new BadRequestException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		if (user.status === RECRUITER_STATUS.BLOCKED) {
			throw new AccountBlockedException();
		}
	}
}

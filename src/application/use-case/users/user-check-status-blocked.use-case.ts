import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "@/application/interface/repository";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { AccountBlockedException } from "@/domain/exceptions";
import { UserEntity } from "@/domain/entity";
import { USER_MESSAGES, USER_STATUS } from "@/domain/enums";
import { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class CheckUserBlockedUseCase implements IExecutable<string, void> {
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly userRepo: IUserRepository<UserEntity>,
	) {}

	async execute(userId: string): Promise<void> {
		const user = await this.userRepo.findById(userId);

		if (!user) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}

		if (user.status === USER_STATUS.BLOCK) {
			throw new AccountBlockedException();
		}
	}
}

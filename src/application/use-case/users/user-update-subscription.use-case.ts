import type { UserSubscriptionUpdateDto } from "@/application/dto/users/user-subscription-update.dto";
import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { UserEntity } from "@/domain/entity/user.entity";
import { USER_MESSAGES } from "@/domain/enums";
import { NotFoundException } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserSubscriptionUseCase
	implements IExecutable<{ userId: string; dto: UserSubscriptionUpdateDto }, ResponseUserDto>
{
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers<UserEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
	) {}

	async execute({ userId, dto }: { userId: string; dto: UserSubscriptionUpdateDto }): Promise<ResponseUserDto> {
		const user = await this._userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		user.changeSubscription(dto.subscription);

		// Auto-assign badge for paid plans (assuming 'free' is the basic plan)
		if (dto.subscription.current_plan.toLowerCase() !== "free") {
			user.changeBadge(true);
		} else {
			user.changeBadge(false);
		}

		const updatedUser = await this._userRepository.findByIdAndUpdate(userId, user);

		if (!updatedUser) {
			throw new NotFoundException("Failed to update subscription");
		}

		return this._userMapper.toResponse(updatedUser);
	}
}

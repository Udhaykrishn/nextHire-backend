import type { UpdateUserDto } from "@/application/dto/users/user-update.dto";
import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { UserEntity } from "@/domain/entity/user.entity";
import { USER_MESSAGES } from "@/domain/enums";
import { NotFoundException } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UpdateUserUseCase
	implements
		IExecutable<{ userId: string; data: UpdateUserDto }, ResponseUserDto>
{
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
	) {}

	async execute({
		userId,
		data,
	}: {
		userId: string;
		data: UpdateUserDto;
	}): Promise<ResponseUserDto> {
		const user = await this._userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		if (data.email) {
			user.changeEmail(data.email);
		}
		if (data.name) {
			user.changeName(data.name);
		}
		if (data.phone) {
			user.changePhone(data.phone);
		}
		if (data.experience) {
			user.changeExperience(data.experience);
		}
		if (data.role_of_title) {
			user.changeRoleOfTitle(data.role_of_title);
		}
		if (data.resume_url) {
			user.changeResumeUrl(data.resume_url);
		}
		if (data.bio) {
			user.changeBio(data.bio);
		}
		if (data.social_link) {
			user.changeSocialLink(data.social_link);
		}

		const updatedUser = await this._userRepository.findByIdAndUpdate(
			userId,
			user,
		);

		if (!updatedUser) {
			throw new NotFoundException("Failed to update");
		}

		return this._userMapper.toResponse(updatedUser);
	}
}

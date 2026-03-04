import { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity/user.entity";
import { USER_MESSAGES } from "@/domain/enums";
import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class DeleteProfileImageUseCase implements IExecutable<string, ResponseUserDto> {
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers<UserEntity>,
		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) {}

	async execute(userId: string): Promise<ResponseUserDto> {
		const user = await this._userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		if (user.profile_url?.key) {
			await this._s3Service.deleteFile(user.profile_url.key);
		}

		// Reset profile_url to default/empty
		user.changeProfileUrl("", "");

		const updatedUser = await this._userRepository.findByIdAndUpdate(userId, user);

		if (!updatedUser) {
			throw new NotFoundException("Failed to update user after deleting profile image");
		}

		return this._userMapper.toResponse(updatedUser);
	}
}

import { Inject, Injectable } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { NotFoundException } from "@nestjs/common";
import { USER_MESSAGES } from "@/domain/enums";
import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";

interface UploadProfileImageInput {
	userId: string;
	file: Express.Multer.File;
}

@Injectable()
export class UploadProfileImageUseCase implements IExecutable<UploadProfileImageInput, ResponseUserDto> {
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _mapper: IUserApplicationMappers<UserEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) {}

	async execute(input: UploadProfileImageInput): Promise<ResponseUserDto> {
		const { userId, file } = input;

		const user = await this._userRepository.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		if (user.profile_url?.key) {
			try {
				await this._s3Service.deleteFile(user.profile_url.key);
			} catch (error) {
				console.error("Error deleting old profile image:", error);
			}
		}

		const fileInfo = await this._s3Service.uploadFile(file);

		user.changeProfileUrl(fileInfo.key, fileInfo.url);

		const updatedUser = await this._userRepository.findByIdAndUpdate(userId, user);

		if (!updatedUser) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		return this._mapper.toResponse(updatedUser);
	}
}

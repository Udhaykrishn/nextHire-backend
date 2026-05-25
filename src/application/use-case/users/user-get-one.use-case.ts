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

import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";

@Injectable()
export class GetOneUserUseCase implements IExecutable<string, ResponseUserDto> {
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers<UserEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) {}

	async execute(userId: string): Promise<ResponseUserDto> {
		const user = await this._userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		if (user.profile_url?.key) {
			try {
				const signedUrl = await this._s3Service.getSignedUrlForRead(user.profile_url.key);
				user.changeProfileUrl(user.profile_url.key, signedUrl);
			} catch (error) {
				console.error("Error signing profile URL:", error);
			}
		}

		if (user.resume_url?.key) {
			try {
				const signedUrl = await this._s3Service.getSignedUrlForRead(user.resume_url.key);
				user.changeResumeUrl(user.resume_url.key, signedUrl);
			} catch (error) {
				console.error("Error signing resume URL:", error);
			}
		}

		return this._userMapper.toResponse(user);
	}
}

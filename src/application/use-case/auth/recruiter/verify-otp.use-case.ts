import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { v4 as uuid } from "uuid";
import { REDIS_KEYS } from "@/domain/enums/keys";
import type { VerifyOTPDto, VerifyResponseOTPDto } from "@/application/dto/auth/otp";
import { RECRUITER_MAPPER } from "@/application/enums";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { RECRUITER_STATUS, USER_ROLE } from "@/domain/enums/status";
import { AUTH_EVENTS } from "@/domain/enums/events.enum";
import type { IEventEmitter } from "@/infrastructure/services/interface/event-emitter.interface";

@Injectable()
export class VerifyRecruiterOtpUseCase implements IExecutable<VerifyOTPDto, VerifyResponseOTPDto> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,

		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,

		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,

		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _recruiterMapper: IRecruiterApplicationMappers<RecruiterEntity>,

		@Inject(COMMON_TOKEN.EVENT_EMITTER)
		private readonly eventEmitter: IEventEmitter,
	) {}

	async execute(dto: VerifyOTPDto): Promise<VerifyResponseOTPDto> {
		const recruiter = await this._redisService.get(
			REDIS_KEYS.VERIFY_OTP.concat(dto.email).concat(":", USER_ROLE.RECRUITER),
		);

		if (!recruiter) {
			throw new BadRequestException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		const recruiterData = this._recruiterMapper.toDomain(JSON.parse(recruiter));

		const otp = await this._redisService.get(
			REDIS_KEYS.OTP.concat(recruiterData.email).concat(":", USER_ROLE.RECRUITER),
		);

		if (!otp) {
			throw new BadRequestException("Otp not found");
		}

		if (otp !== dto.otp) {
			throw new BadRequestException("Invalid otp");
		}

		recruiterData.changeStatus(RECRUITER_STATUS.ACTIVE);

		const createRecruiter = await this._recruiterRepository.save(recruiterData);

		const payload = {
			role: USER_ROLE.RECRUITER,
			email: createRecruiter.email,
			id: createRecruiter.id as string,
		};

		const accessToken = await this._jwtService.generateToken(payload, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);

		const refreshToken = await this._jwtService.generateToken(payload, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		const sessionId = uuid();

		await this._redisService.set(REDIS_KEYS.REFRESH.concat(sessionId), refreshToken);

		await this._redisService.del(REDIS_KEYS.OTP.concat(recruiterData.email).concat(":", USER_ROLE.RECRUITER));
		await this._redisService.del(
			REDIS_KEYS.VERIFY_OTP.concat(recruiterData.email).concat(":", USER_ROLE.RECRUITER),
		);

		this.eventEmitter.emit(AUTH_EVENTS.RECRUITER_SIGNUP, {
			email: createRecruiter.email,
			name: createRecruiter.name,
		});

		return {
			accessToken,
			sessionId,
		};
	}
}

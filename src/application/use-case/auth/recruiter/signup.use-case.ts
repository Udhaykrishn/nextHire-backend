import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IOtpService, IPasswordHash, IRedisService } from "@/infrastructure/services/interface";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { RECRUITER_MAPPER } from "@/application/enums";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { RecruiterSignResponseDto, RecruiterSignupDto } from "@/application/dto/auth/recruiter/signup";
import { USER_ROLE } from "@/domain/enums";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AUTH_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class RecruiterRegisterUseCase implements IExecutable<RecruiterSignupDto, RecruiterSignResponseDto> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,

		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHash: IPasswordHash,

		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,

		@Inject(COMMON_TOKEN.OTP_SERVICE)
		private readonly _otpService: IOtpService,

		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _recruiterMapper: IRecruiterApplicationMappers<RecruiterEntity>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async execute(dto: RecruiterSignupDto): Promise<RecruiterSignResponseDto> {
		const hashedPassword = await this._passwordHash.hash(dto.password);

		const recruiter = RecruiterEntity.create({
			email: dto.email,
			password: hashedPassword,
			name: dto.name,
			phone: dto.phone,
		});

		const existingRecruiter = await this._recruiterRepository.findOne({
			email: recruiter.email,
		});
		if (existingRecruiter) {
			throw new UnauthorizedException(RECRUITER_MESSAGES.RECRUITER_ALREADY_EXISTS);
		}

		const otp = this._otpService.generate(6);

		console.log("Recruiter OTP:", otp);

		await this._redisService.set(REDIS_KEYS.OTP.concat(recruiter.email).concat(":", USER_ROLE.RECRUITER), otp, 300);

		await this._redisService.set(
			REDIS_KEYS.VERIFY_OTP.concat(recruiter.email).concat(":", USER_ROLE.RECRUITER),
			JSON.stringify({
				...this._recruiterMapper.toResponse(recruiter),
				password: recruiter.password,
			}),
		);

		this.eventEmitter.emit(AUTH_EVENTS.OTP_GENERATED, {
			email: recruiter.email,
			name: recruiter.name,
			otp,
		});

		return {
			otp,
			email: recruiter.email,
		};
	}
}

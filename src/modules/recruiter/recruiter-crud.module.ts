import { Module } from "@nestjs/common";
import { CommonModule } from "../common.module";
import { RecruiterLiteModule } from "./recuriter-lite.module";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import {
	BlockUnblockRecruiterUseCase,
	CreateRecruiterUseCase,
	GetAllRecruitersUseCase,
	GetOneRecruiterUseCase,
	RecruiterChangePasswordUseCase,
	UpdateRecruiterUseCase,
	UploadRecruiterProfileImageUseCase,
	DeleteRecruiterProfileImageUseCase,
	RecruiterFindByEmailUseCase,
	VerifyRecruiterCompanyUseCase,
	SubscribeRecruiterUseCase,
	StartVerificationSessionUseCase,
	GetVerificationSessionUseCase,
	VerifyOtpSessionUseCase,
	DeleteVerificationSessionUseCase,
	RevokeCompanyVerificationUseCase,
} from "@/application/use-case/recuriters";

import { CheckRecruiterBlockedUseCase } from "@/application/use-case/recuriters";
import { CompanyVerificationService } from "@/infrastructure/services/implements/company-verification.service";

import { JobLiteModule } from "../job/job-lite.module";
import { RedisModule } from "../redis.module";

@Module({
	imports: [RecruiterLiteModule, CommonModule, JobLiteModule, RedisModule],
	providers: [
		{
			provide: RECRUITER_TOKEN.RECRUITER_CREATE_USE_CASE,
			useClass: CreateRecruiterUseCase,
		},
		{
			provide: RECRUITER_TOKEN.RECRUITER_UPDATE_USE_CASE,
			useClass: UpdateRecruiterUseCase,
		},
		{
			provide: RECRUITER_TOKEN.RECRUITER_GET_ALL_USE_CASE,
			useClass: GetAllRecruitersUseCase,
		},
		{
			provide: RECRUITER_TOKEN.RECRUITER_GET_ONE_USE_CASE,
			useClass: GetOneRecruiterUseCase,
		},
		{
			provide: RECRUITER_TOKEN.RECRUITER_BLOCK_UNBLOCK_USE_CASE,
			useClass: BlockUnblockRecruiterUseCase,
		},
		{
			provide: RECRUITER_TOKEN.RECRUITER_CHANGE_PASSWORD_USE_CASE,
			useClass: RecruiterChangePasswordUseCase,
		},
		{
			provide: RECRUITER_TOKEN.CHECK_RECRUITER_BLOCKED_USE_CASE,
			useClass: CheckRecruiterBlockedUseCase,
		},
		{
			provide: RECRUITER_TOKEN.UPLOAD_PROFILE_IMAGE_USE_CASE,
			useClass: UploadRecruiterProfileImageUseCase,
		},
		{
			provide: RECRUITER_TOKEN.DELETE_PROFILE_IMAGE_USE_CASE,
			useClass: DeleteRecruiterProfileImageUseCase,
		},
		{
			provide: RECRUITER_TOKEN.RECRUITER_FIND_BY_EMAIL_USE_CASE,
			useClass: RecruiterFindByEmailUseCase,
		},
		{
			provide: RECRUITER_TOKEN.VERIFY_RECRUITER_COMPANY_USE_CASE,
			useClass: VerifyRecruiterCompanyUseCase,
		},
		{
			provide: RECRUITER_TOKEN.SUBSCRIBE_RECRUITER_USE_CASE,
			useClass: SubscribeRecruiterUseCase,
		},
		{
			provide: RECRUITER_TOKEN.COMPANY_VERIFICATION_SERVICE,
			useClass: CompanyVerificationService,
		},
		{
			provide: RECRUITER_TOKEN.START_VERIFICATION_SESSION_USE_CASE,
			useClass: StartVerificationSessionUseCase,
		},
		{
			provide: RECRUITER_TOKEN.GET_VERIFICATION_SESSION_USE_CASE,
			useClass: GetVerificationSessionUseCase,
		},
		{
			provide: RECRUITER_TOKEN.VERIFY_OTP_SESSION_USE_CASE,
			useClass: VerifyOtpSessionUseCase,
		},
		{
			provide: RECRUITER_TOKEN.DELETE_VERIFICATION_SESSION_USE_CASE,
			useClass: DeleteVerificationSessionUseCase,
		},
		{
			provide: RECRUITER_TOKEN.REVOKE_COMPANY_VERIFICATION_USE_CASE,
			useClass: RevokeCompanyVerificationUseCase,
		},

	],
	exports: [
		RECRUITER_TOKEN.RECRUITER_CREATE_USE_CASE,
		RECRUITER_TOKEN.RECRUITER_UPDATE_USE_CASE,
		RECRUITER_TOKEN.RECRUITER_GET_ALL_USE_CASE,
		RECRUITER_TOKEN.RECRUITER_GET_ONE_USE_CASE,
		RECRUITER_TOKEN.RECRUITER_BLOCK_UNBLOCK_USE_CASE,
		RECRUITER_TOKEN.RECRUITER_CHANGE_PASSWORD_USE_CASE,
		RECRUITER_TOKEN.CHECK_RECRUITER_BLOCKED_USE_CASE,
		RECRUITER_TOKEN.UPLOAD_PROFILE_IMAGE_USE_CASE,
		RECRUITER_TOKEN.DELETE_PROFILE_IMAGE_USE_CASE,
		RECRUITER_TOKEN.RECRUITER_FIND_BY_EMAIL_USE_CASE,
		RECRUITER_TOKEN.VERIFY_RECRUITER_COMPANY_USE_CASE,
		RECRUITER_TOKEN.SUBSCRIBE_RECRUITER_USE_CASE,
		RECRUITER_TOKEN.START_VERIFICATION_SESSION_USE_CASE,
		RECRUITER_TOKEN.GET_VERIFICATION_SESSION_USE_CASE,
		RECRUITER_TOKEN.VERIFY_OTP_SESSION_USE_CASE,
		RECRUITER_TOKEN.DELETE_VERIFICATION_SESSION_USE_CASE,
		RECRUITER_TOKEN.REVOKE_COMPANY_VERIFICATION_USE_CASE,

	],
})
export class RecruiterCrudModule {}

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
} from "@/application/use-case/recuriters";
import { CheckRecruiterBlockedUseCase } from "@/application/use-case/recuriters";
import { S3Service } from "@/infrastructure/services/implements";

@Module({
	imports: [RecruiterLiteModule, CommonModule],
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
			provide: "S3_SERVICE",
			useClass: S3Service,
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
		"S3_SERVICE",
	],
})
export class RecruiterCrudModule { }

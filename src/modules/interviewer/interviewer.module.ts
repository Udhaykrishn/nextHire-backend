import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CompanyInterviewer, CompanyInterviewerSchema } from "@/infrastructure/db/mongodb/models/interviewer.schema";
import {
	InterviewerTemplate,
	InterviewerTemplateSchema,
} from "@/infrastructure/db/mongodb/models/interviewer-template.schema";
import { InterviewRound, InterviewRoundSchema } from "@/infrastructure/db/mongodb/models/interview-round.schema";

import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer.repository";
import { InterviewerTemplateRepository } from "@/infrastructure/db/mongodb/repository/interviewer-template.repository";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round.repository";

import { InterviewerPersistenceMapper } from "@/infrastructure/mappers/interviewer-persistence.mapper";
import { InterviewerTemplatePersistenceMapper } from "@/infrastructure/mappers/interviewer-template-persistence.mapper";
import { InterviewRoundPersistenceMapper } from "@/infrastructure/mappers/interview-round-persistence.mapper";

import { ScheduleRoundUseCase } from "@/application/use-case/interviewer/schedule-round.use-case";
import { UpdateInterviewRoundUseCase } from "@/application/use-case/interviewer/update-interview-round.use-case";
import { RequestRescheduleUseCase } from "@/application/use-case/interviewer/request-reschedule.use-case";
import { ApproveRescheduleUseCase } from "@/application/use-case/interviewer/approve-reschedule.use-case";
import { ListRoundsForApplicationUseCase } from "@/application/use-case/interviewer/list-rounds-for-application.use-case";
import { InterviewerLoginUseCase } from "@/application/use-case/interviewer/interviewer-login.use-case";
import { InterviewerRefreshUseCase } from "@/application/use-case/interviewer/interviewer-refresh.use-case";
import { GetInterviewerProfileUseCase } from "@/application/use-case/interviewer/get-interviewer-profile.use-case";
import { ListAssignedRoundsUseCase } from "@/application/use-case/interviewer/list-assigned-rounds.use-case";
import { SubmitFeedbackUseCase } from "@/application/use-case/interviewer/submit-feedback.use-case";
import { ConfirmRoundUseCase } from "@/application/use-case/interviewer/confirm-round.use-case";
import { GetRoundByCodeUseCase } from "@/application/use-case/interviewer/get-round-by-code.use-case";
import { JoinRoundRoomUseCase } from "@/application/use-case/interviewer/join-round-room.use-case";
import { ListCandidateRoundsUseCase } from "@/application/use-case/interviewer/list-candidate-rounds.use-case";

import { InterviewerController } from "@/presentation/controller/interviewer/interviewer.controller";
import { JobLiteModule } from "../job/job-lite.module";
import { UserLiteModule } from "../user/user-db.module";
import { CommonModule } from "../common.module";
import { RecruiterLiteModule } from "../recruiter/recuriter-lite.module";
import { JwtService } from "@/infrastructure/services/implements";
import { COMMON_TOKEN } from "@/application/enums/tokens";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: CompanyInterviewer.name, schema: CompanyInterviewerSchema },
			{ name: InterviewerTemplate.name, schema: InterviewerTemplateSchema },
			{ name: InterviewRound.name, schema: InterviewRoundSchema },
		]),
		JobLiteModule,
		UserLiteModule,
		CommonModule,
		RecruiterLiteModule,
	],
	controllers: [InterviewerController],
	providers: [
		InterviewerPersistenceMapper,
		InterviewerTemplatePersistenceMapper,
		InterviewRoundPersistenceMapper,
		InterviewerRepository,
		InterviewerTemplateRepository,
		InterviewRoundRepository,
		{ provide: COMMON_TOKEN.JWT_SERVICE, useClass: JwtService },

		ScheduleRoundUseCase,
		UpdateInterviewRoundUseCase,
		RequestRescheduleUseCase,
		ApproveRescheduleUseCase,
		ListRoundsForApplicationUseCase,
		InterviewerLoginUseCase,
		InterviewerRefreshUseCase,
		GetInterviewerProfileUseCase,
		ListAssignedRoundsUseCase,
		SubmitFeedbackUseCase,
		ConfirmRoundUseCase,
		GetRoundByCodeUseCase,
		JoinRoundRoomUseCase,
		ListCandidateRoundsUseCase,
	],
	exports: [InterviewerRepository, InterviewerTemplateRepository, InterviewRoundRepository],
})
export class InterviewerModule {}

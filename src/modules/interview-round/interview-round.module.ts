import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InterviewRound, InterviewRoundSchema } from "@/infrastructure/db/mongodb/models/interview-round.schema";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { InterviewRoundPersistenceMapper } from "@/infrastructure/mappers/interview-round-persistence.mapper";

import { ScheduleRoundUseCase } from "@/application/use-case/interview-round/schedule-round.use-case";
import { UpdateInterviewRoundUseCase } from "@/application/use-case/interview-round/update-interview-round.use-case";
import { RequestRescheduleUseCase } from "@/application/use-case/interview-round/request-reschedule.use-case";
import { ApproveRescheduleUseCase } from "@/application/use-case/interview-round/approve-reschedule.use-case";
import { ListRoundsForApplicationUseCase } from "@/application/use-case/interview-round/list-rounds-for-application.use-case";
import { EndInterviewRoundUseCase } from "@/application/use-case/interview-round/end-interview-round.use-case";
import { ListAssignedRoundsUseCase } from "@/application/use-case/interview-round/list-assigned-rounds.use-case";
import { SubmitFeedbackUseCase } from "@/application/use-case/interview-round/submit-feedback.use-case";
import { ConfirmRoundUseCase } from "@/application/use-case/interview-round/confirm-round.use-case";
import { ListCandidateRoundsUseCase } from "@/application/use-case/interview-round/list-candidate-rounds.use-case";

import { RecruiterInterviewController } from "@/presentation/controller/interview-round/recruiter-interview.controller";
import { InterviewerInterviewController } from "@/presentation/controller/interview-round/interviewer-interview.controller";
import { CandidateInterviewController } from "@/presentation/controller/interview-round/candidate-interview.controller";

import { JobLiteModule } from "../job/job-lite.module";
import { UserLiteModule } from "../user/user-db.module";
import { CommonModule } from "../common.module";
import { RecruiterLiteModule } from "../recruiter/recuriter-lite.module";
import { InterviewerModule } from "../interviewer/interviewer.module";
import { TemplateModule } from "../template/template.module";
import { JwtService } from "@/infrastructure/services/implements";
import { COMMON_TOKEN } from "@/application/enums/tokens";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: InterviewRound.name, schema: InterviewRoundSchema }]),
		JobLiteModule,
		UserLiteModule,
		CommonModule,
		RecruiterLiteModule,
		InterviewerModule,
		TemplateModule,
	],
	controllers: [RecruiterInterviewController, InterviewerInterviewController, CandidateInterviewController],
	providers: [
		InterviewRoundPersistenceMapper,
		InterviewRoundRepository,
		{ provide: COMMON_TOKEN.JWT_SERVICE, useClass: JwtService },

		ScheduleRoundUseCase,
		UpdateInterviewRoundUseCase,
		RequestRescheduleUseCase,
		ApproveRescheduleUseCase,
		ListRoundsForApplicationUseCase,
		EndInterviewRoundUseCase,
		ListAssignedRoundsUseCase,
		SubmitFeedbackUseCase,
		ConfirmRoundUseCase,
		ListCandidateRoundsUseCase,
	],
	exports: [InterviewRoundRepository],
})
export class InterviewRoundModule {}

import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CompanyInterviewer, CompanyInterviewerSchema } from "@/infrastructure/db/mongodb/models/interviewer.schema";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";
import { InterviewerPersistenceMapper } from "@/infrastructure/mappers/interviewer-persistence.mapper";

import { InterviewerLoginUseCase } from "@/application/use-case/interviewer/interviewer-login.use-case";
import { InterviewerRefreshUseCase } from "@/application/use-case/interviewer/interviewer-refresh.use-case";
import { GetInterviewerProfileUseCase } from "@/application/use-case/interviewer/get-interviewer-profile.use-case";
import { CreateInterviewerUseCase } from "@/application/use-case/interviewer/create-interviewer.use-case";
import { ListInterviewersUseCase } from "@/application/use-case/interviewer/list-interviewers.use-case";
import { DeleteInterviewerUseCase } from "@/application/use-case/interviewer/delete-interviewer.use-case";

import { InterviewerAuthProfileController } from "@/presentation/controller/interviewer/interviewer-auth.controller";
import { RecruiterInterviewerController } from "@/presentation/controller/interviewer/recruiter-interviewer.controller";

import { CommonModule } from "../common.module";
import { JwtService } from "@/infrastructure/services/implements";
import { COMMON_TOKEN } from "@/application/enums/tokens";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: CompanyInterviewer.name, schema: CompanyInterviewerSchema }]),
		CommonModule,
	],
	controllers: [InterviewerAuthProfileController, RecruiterInterviewerController],
	providers: [
		InterviewerPersistenceMapper,
		InterviewerRepository,
		{ provide: COMMON_TOKEN.JWT_SERVICE, useClass: JwtService },

		InterviewerLoginUseCase,
		InterviewerRefreshUseCase,
		GetInterviewerProfileUseCase,
		CreateInterviewerUseCase,
		ListInterviewersUseCase,
		DeleteInterviewerUseCase,
	],
	exports: [InterviewerRepository],
})
export class InterviewerModule {}

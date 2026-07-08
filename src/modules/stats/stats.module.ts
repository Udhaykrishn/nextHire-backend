import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { StatsController } from "../../presentation/controller/stats/implements/stats.controller";
import { GetOverviewStatsUseCase } from "../../application/use-case/stats/get-overview-stats.use-case";
import { StatsRepository } from "../../infrastructure/database/mongo/repository/stats/stats.repository";
import { STATS_TOKEN } from "../../application/enums/stats";
import { Jobs, JobsSchema } from "../../infrastructure/db/mongodb/models/job.schema";
import { Application, ApplicationSchema } from "../../infrastructure/db/mongodb/models/application.schema";
import { InterviewRound, InterviewRoundSchema } from "../../infrastructure/db/mongodb/models/interview-round.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Jobs.name, schema: JobsSchema },
			{ name: Application.name, schema: ApplicationSchema },
			{ name: InterviewRound.name, schema: InterviewRoundSchema },
		]),
	],
	controllers: [StatsController],
	providers: [
		{
			provide: STATS_TOKEN.STATS_REPOSITORY,
			useClass: StatsRepository,
		},
		{
			provide: STATS_TOKEN.GET_OVERVIEW_STATS_USE_CASE,
			useClass: GetOverviewStatsUseCase,
		},
	],
})
export class StatsModule {}

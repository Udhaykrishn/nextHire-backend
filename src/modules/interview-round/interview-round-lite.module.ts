import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InterviewRound, InterviewRoundSchema } from "@/infrastructure/db/mongodb/models/interview-round.schema";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { InterviewRoundPersistenceMapper } from "@/infrastructure/mappers/interview-round-persistence.mapper";

// Lightweight module that only exposes the InterviewRoundRepository, so other
// modules (e.g. interviewer) can query rounds without importing the full
// InterviewRoundModule and creating a circular dependency.
@Module({
	imports: [MongooseModule.forFeature([{ name: InterviewRound.name, schema: InterviewRoundSchema }])],
	providers: [InterviewRoundRepository, InterviewRoundPersistenceMapper],
	exports: [InterviewRoundRepository],
})
export class InterviewRoundLiteModule {}

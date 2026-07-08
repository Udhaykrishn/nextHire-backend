import { Module } from "@nestjs/common";
import { VideoCallController } from "@/presentation/controller/video-call/video-call.controller";
import { JoinRoundRoomUseCase } from "@/application/use-case/interview-round/join-round-room.use-case";
import { GetRoundByCodeUseCase } from "@/application/use-case/interview-round/get-round-by-code.use-case";

import { InterviewRoundModule } from "../interview-round/interview-round.module";
import { InterviewerModule } from "../interviewer/interviewer.module";
import { CommonModule } from "../common.module";
import { JwtService } from "@/infrastructure/services/implements";
import { COMMON_TOKEN } from "@/application/enums/tokens";

@Module({
	imports: [InterviewRoundModule, InterviewerModule, CommonModule],
	controllers: [VideoCallController],
	providers: [
		{ provide: COMMON_TOKEN.JWT_SERVICE, useClass: JwtService },
		JoinRoundRoomUseCase,
		GetRoundByCodeUseCase,
	],
})
export class VideoCallModule {}

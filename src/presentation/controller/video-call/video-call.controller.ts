import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { ROLES, INTERVIEWER_ROUTERS } from "@/presentation/enums";

import { JoinRoundRoomUseCase } from "@/application/use-case/interview-round/join-round-room.use-case";
import { GetRoundByCodeUseCase } from "@/application/use-case/interview-round/get-round-by-code.use-case";

@UseGuards(AuthGuard, RoleGuard)
@Controller(INTERVIEWER_ROUTERS.ROOM_ROUNDS)
export class VideoCallController {
	constructor(
		private readonly _getRoundByCodeUseCase: GetRoundByCodeUseCase,
		private readonly _joinRoundRoomUseCase: JoinRoundRoomUseCase,
	) {}

	@Roles(ROLES.USER, ROLES.INTERVIEWER, ROLES.RECRUITER)
	@Get(INTERVIEWER_ROUTERS.MEETING_CODE)
	@HttpCode(HttpStatus.OK)
	async getRoundRoom(@Param("meetingCode") meetingCode: string) {
		return this._getRoundByCodeUseCase.execute(meetingCode);
	}

	@Roles(ROLES.USER, ROLES.INTERVIEWER, ROLES.RECRUITER)
	@Post(INTERVIEWER_ROUTERS.JOIN_ROOM)
	@HttpCode(HttpStatus.OK)
	async joinRoundRoom(
		@Param("meetingCode") meetingCode: string,
		@Body() body: any,
	) {
		return this._joinRoundRoomUseCase.execute({
			meetingCode,
			role: body.role,
		});
	}
}

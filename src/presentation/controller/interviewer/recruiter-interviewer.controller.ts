import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards, Req } from "@nestjs/common";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { ROLES, INTERVIEWER_ROUTERS } from "@/presentation/enums";
import type { Request } from "express";

import { CreateInterviewerUseCase } from "@/application/use-case/interviewer/create-interviewer.use-case";
import { CreateInterviewerDto } from "@/application/dto/interviewer/create-interviewer.dto";
import { ListInterviewersUseCase } from "@/application/use-case/interviewer/list-interviewers.use-case";
import { DeleteInterviewerUseCase } from "@/application/use-case/interviewer/delete-interviewer.use-case";

@UseGuards(AuthGuard, RoleGuard)
@Roles(ROLES.RECRUITER)
@Controller(INTERVIEWER_ROUTERS.RECRUITER_INTERVIEWERS)
export class RecruiterInterviewerController {
	constructor(
		private readonly _createInterviewerUseCase: CreateInterviewerUseCase,
		private readonly _listInterviewersUseCase: ListInterviewersUseCase,
		private readonly _deleteInterviewerUseCase: DeleteInterviewerUseCase,
	) { }

	@Post(INTERVIEWER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.CREATED)
	async createInterviewer(@Req() req: Request, @Body() dto: CreateInterviewerDto) {
		const fullDto: CreateInterviewerDto = {
			...dto,
			companyId: req.user.companyId || req.user.id,
			createdBy: req.user.id,
		};
		return this._createInterviewerUseCase.execute(fullDto);
	}

	@Get(INTERVIEWER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.OK)
	async listInterviewers(@Req() req: Request) {
		return this._listInterviewersUseCase.execute(req.user.companyId || req.user.id);
	}

	@Delete(INTERVIEWER_ROUTERS.ID)
	@HttpCode(HttpStatus.OK)
	async deleteInterviewer(@Param("id") id: string) {
		return this._deleteInterviewerUseCase.execute(id);
	}
}

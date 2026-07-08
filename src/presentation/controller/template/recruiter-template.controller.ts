import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Patch,
	UseGuards,
	Req,
} from "@nestjs/common";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { ROLES, INTERVIEWER_ROUTERS } from "@/presentation/enums";
import type { Request } from "express";

import { CreateTemplateUseCase } from "@/application/use-case/template/create-template.use-case";
import { CreateTemplateDto, UpdateTemplateDto } from "@/application/dto/template/template.dto";
import { ListTemplatesUseCase } from "@/application/use-case/template/list-templates.use-case";
import { UpdateTemplateUseCase } from "@/application/use-case/template/update-template.use-case";
import { DeleteTemplateUseCase } from "@/application/use-case/template/delete-template.use-case";

@UseGuards(AuthGuard, RoleGuard)
@Roles(ROLES.RECRUITER)
@Controller(INTERVIEWER_ROUTERS.RECRUITER_TEMPLATES)
export class RecruiterTemplateController {
	constructor(
		private readonly _createTemplateUseCase: CreateTemplateUseCase,
		private readonly _listTemplatesUseCase: ListTemplatesUseCase,
		private readonly _updateTemplateUseCase: UpdateTemplateUseCase,
		private readonly _deleteTemplateUseCase: DeleteTemplateUseCase,
	) {}

	@Post(INTERVIEWER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.CREATED)
	async createTemplate(@Req() req: Request, @Body() dto: CreateTemplateDto) {
		const fullDto: CreateTemplateDto = {
			...dto,
			companyId: req.user.companyId || req.user.id,
		};
		return this._createTemplateUseCase.execute(fullDto);
	}

	@Get(INTERVIEWER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.OK)
	async listTemplates(@Req() req: Request) {
		return this._listTemplatesUseCase.execute(req.user.companyId || req.user.id);
	}

	@Patch(INTERVIEWER_ROUTERS.ID)
	@HttpCode(HttpStatus.OK)
	async updateTemplate(@Req() req: Request, @Param("id") id: string, @Body() dto: UpdateTemplateDto) {
		return this._updateTemplateUseCase.execute({
			...dto,
			templateId: id,
			companyId: req.user.companyId || req.user.id,
		});
	}

	@Delete(INTERVIEWER_ROUTERS.ID)
	@HttpCode(HttpStatus.OK)
	async deleteTemplate(@Param("id") id: string) {
		return this._deleteTemplateUseCase.execute(id);
	}
}

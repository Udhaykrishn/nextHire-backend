import { CreateCertificateDto } from "@/application/dto/certificate/create-certificate.dto";
import { UpdateCertificateDto } from "@/application/dto/certificate/update-certificate.dto";
import { ResponseCertificateDto } from "@/application/dto/certificate/response-certificate.dto";
import { CERTIFICATE_TOKEN } from "@/application/enums/tokens/certificate-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { RoleGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/role.decorator";
import { USER_ROLE } from "@/domain/enums";
import { CERTIFICATE_ROUTER } from "@/presentation/enums";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards, Query } from "@nestjs/common";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";

@Controller(CERTIFICATE_ROUTER.ROUTER)
@UseGuards(AuthGuard, RoleGuard)
@Roles(USER_ROLE.USER, USER_ROLE.ADMIN)
export class CertificateController {
	constructor(
		@Inject(CERTIFICATE_TOKEN.CREATE_CERTIFICATE_USE_CASE)
		private readonly _createCertificateUseCase: IExecutable<CreateCertificateDto, ResponseCertificateDto>,
		@Inject(CERTIFICATE_TOKEN.GET_CERTIFICATES_USE_CASE)
		private readonly _getCertificatesUseCase: IExecutable<string, ResponseCertificateDto[]>,
		@Inject(CERTIFICATE_TOKEN.UPDATE_CERTIFICATE_USE_CASE)
		private readonly _updateCertificateUseCase: IExecutable<UpdateCertificateDto, ResponseCertificateDto>,
		@Inject(CERTIFICATE_TOKEN.DELETE_CERTIFICATE_USE_CASE)
		private readonly _deleteCertificateUseCase: IExecutable<string, void>,
	) {}

	@Post(CERTIFICATE_ROUTER.DEFAULT)
	async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCertificateDto) {
		dto.userId = req.user.id;
		return await this._createCertificateUseCase.execute(dto);
	}

	@Get(CERTIFICATE_ROUTER.DEFAULT)
	async getAll(@Req() req: AuthenticatedRequest, @Query("userId") userId?: string) {
		const targetUserId = req.user.role === USER_ROLE.ADMIN && userId ? userId : req.user.id;
		return await this._getCertificatesUseCase.execute(targetUserId);
	}

	@Put(CERTIFICATE_ROUTER.ID)
	async update(@Param(CERTIFICATE_ROUTER.ID_PARAM) id: string, @Body() dto: UpdateCertificateDto) {
		dto.id = id;
		return await this._updateCertificateUseCase.execute(dto);
	}

	@Delete(CERTIFICATE_ROUTER.ID)
	async delete(@Param(CERTIFICATE_ROUTER.ID_PARAM) id: string) {
		return await this._deleteCertificateUseCase.execute(id);
	}
}

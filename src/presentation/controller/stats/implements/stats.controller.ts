import { Controller, Get, Inject, Req, Query, UseGuards } from "@nestjs/common";
import { AuthGuard, RoleGuard } from "../../../guards";
import { Roles } from "../../../decorators";
import { ROLES, STATS_ROUTERS } from "../../../enums";
import { IStatsController } from "../interface/stats.interface";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { DashboardMetricsDto } from "@/application/dto/stats/stats.dto";
import { STATS_TOKEN } from "@/application/enums/stats";
import type { Request } from "express";

@UseGuards(AuthGuard, RoleGuard)
@Roles(ROLES.RECRUITER)
@Controller(STATS_ROUTERS.ROUTER)
export class StatsController implements IStatsController {
	constructor(
		@Inject(STATS_TOKEN.GET_OVERVIEW_STATS_USE_CASE)
		private readonly _getOverviewStatsUseCase: IExecutable<
			{ recruiterId: string; range?: string },
			DashboardMetricsDto
		>,
	) {}

	@Get(STATS_ROUTERS.OVERVIEW)
	async getOverviewStats(
		@Req() req: Request & { user?: { id?: string; _id?: string } },
		@Query("range") range?: string,
	): Promise<DashboardMetricsDto> {
		const recruiterId = req.user?._id as string;
		return this._getOverviewStatsUseCase.execute({ recruiterId, range });
	}
}

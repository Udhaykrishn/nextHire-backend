import { Inject, Injectable } from "@nestjs/common";
import { IExecutable } from "../../interface/executable.interface";
import { DashboardMetricsDto } from "../../dto/stats/stats.dto";
import { type IStatsRepository } from "../../interface/repository/stats.repository.interface";
import { STATS_TOKEN } from "../../enums/stats";

@Injectable()
export class GetOverviewStatsUseCase
	implements IExecutable<{ recruiterId: string; range?: string }, DashboardMetricsDto>
{
	constructor(
		@Inject(STATS_TOKEN.STATS_REPOSITORY)
		private readonly _statsRepository: IStatsRepository,
	) {}

	async execute({ recruiterId, range }: { recruiterId: string; range?: string }): Promise<DashboardMetricsDto> {
		return this._statsRepository.getOverviewStats(recruiterId, range);
	}
}

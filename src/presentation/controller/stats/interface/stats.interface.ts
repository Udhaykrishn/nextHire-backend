import { Request } from "express";
import { DashboardMetricsDto } from "@/application/dto/stats/stats.dto";

export interface IStatsController {
	getOverviewStats(req: Request): Promise<DashboardMetricsDto>;
}

import { DashboardMetricsDto } from "../../dto/stats/stats.dto";

export interface IStatsRepository {
	getOverviewStats(recruiterId: string, range?: string): Promise<DashboardMetricsDto>;
	// We can add specific methods later when the frontend splits the queries
	// getJobPerformanceStats(recruiterId: string): Promise<...>;
	// getCandidateQualityStats(recruiterId: string): Promise<...>;
}

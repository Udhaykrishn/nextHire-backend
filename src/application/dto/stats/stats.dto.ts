export interface DashboardMetricsDto {
	applicationsTrendData: { name: string; applicants: number }[];
	hiringFunnelData: { stage: string; count: number }[];
	kpis: {
		activeJobs: number;
		activeJobsTrend: number;
		totalApplicants: number;
		totalApplicantsTrend: number;
		newApplicantsToday: number;
		newApplicantsTrend: number;
		candidatesToReview: number;
		interviewsToday: number;
		offersPending: number;
		hiredThisMonth: number;
		avgTimeToHireDays: number;
	};
	matrix: {
		pipeline?: { label: string; value: string }[];
		source?: { label: string; value: string }[];
		advanced?: { label: string; value: string }[];
		recruitmentStatus?: { label: string; value: string }[];
		hiringMetrics?: { label: string; value: string }[];
		recruiterProductivity?: { label: string; value: string }[];
		candidateFunnel?: { label: string; value: string }[];
		interviewAnalytics?: { label: string; value: string }[];
		qualityIndicators?: { label: string; value: string }[];
		pendingTasks?: { label: string; value: string; alert?: boolean }[];
		communication?: { label: string; value: string; alert?: boolean }[];
	};
}

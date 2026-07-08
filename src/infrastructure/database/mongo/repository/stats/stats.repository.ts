import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { IStatsRepository } from "@/application/interface/repository/stats.repository.interface";
import { DashboardMetricsDto } from "@/application/dto/stats/stats.dto";
import {
	Application,
	InterviewRound,
	Jobs,
	type ApplicationDocument,
	type InterviewRoundDocument,
	type JobsDocument,
} from "@/infrastructure/db/mongodb/models";

@Injectable()
export class StatsRepository implements IStatsRepository {
	constructor(
		@InjectModel(Jobs.name) private readonly jobsModel: Model<JobsDocument>,
		@InjectModel(Application.name) private readonly applicationModel: Model<ApplicationDocument>,
		@InjectModel(InterviewRound.name) private readonly interviewRoundModel: Model<InterviewRoundDocument>,
	) {}

	async getOverviewStats(recruiterId: string, range?: string): Promise<DashboardMetricsDto> {
		const recruiterJobs = await this.jobsModel.find({ posted_by: recruiterId }).select("_id");
		const jobIds = recruiterJobs.map((j) => j._id.toString());

		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);

		const startOfPeriod = new Date();
		if (range === "Today") {
			startOfPeriod.setHours(0, 0, 0, 0);
		} else if (range === "Week") {
			startOfPeriod.setDate(startOfPeriod.getDate() - startOfPeriod.getDay());
			startOfPeriod.setHours(0, 0, 0, 0);
		} else if (range === "Year") {
			startOfPeriod.setMonth(0, 1);
			startOfPeriod.setHours(0, 0, 0, 0);
		} else {
			startOfPeriod.setDate(1);
			startOfPeriod.setHours(0, 0, 0, 0);
		}

		const [
			activeJobsCount,
			closedJobsCount,
			draftJobsCount,
			totalApplicantsCount,
			newApplicantsTodayCount,
			shortlistedCount,
			hiredCount,
			rejectedCount,
			interviewsScheduled,
			interviewsCompleted,
			interviewsCancelled,
			applicationsTrendRaw,
		] = await Promise.all([
			this.jobsModel.countDocuments({ posted_by: recruiterId, status: "OPEN" }),
			this.jobsModel.countDocuments({ posted_by: recruiterId, status: "CLOSED" }),
			this.jobsModel.countDocuments({ posted_by: recruiterId, status: "DRAFT" }),
			this.applicationModel.countDocuments({ jobId: { $in: jobIds }, createdAt: { $gte: startOfPeriod } }),
			this.applicationModel.countDocuments({ jobId: { $in: jobIds }, createdAt: { $gte: startOfToday } }),
			this.applicationModel.countDocuments({
				jobId: { $in: jobIds },
				status: "SHORTLISTED",
				createdAt: { $gte: startOfPeriod },
			}),
			this.applicationModel.countDocuments({
				jobId: { $in: jobIds },
				status: "HIRED",
				createdAt: { $gte: startOfPeriod },
			}),
			this.applicationModel.countDocuments({
				jobId: { $in: jobIds },
				status: "REJECTED",
				createdAt: { $gte: startOfPeriod },
			}),
			this.interviewRoundModel.countDocuments({
				jobId: { $in: jobIds },
				status: "PENDING",
				createdAt: { $gte: startOfPeriod },
			}),
			this.interviewRoundModel.countDocuments({
				jobId: { $in: jobIds },
				status: "COMPLETED",
				createdAt: { $gte: startOfPeriod },
			}),
			this.interviewRoundModel.countDocuments({
				jobId: { $in: jobIds },
				status: "CANCELLED",
				createdAt: { $gte: startOfPeriod },
			}),
			this.applicationModel.aggregate([
				{ $match: { jobId: { $in: jobIds }, createdAt: { $gte: startOfPeriod } } },
				{
					$group: {
						_id: { $dateToString: { format: "%m-%d", date: "$createdAt" } },
						count: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
			]),
		]);

		const applicationsTrendData = applicationsTrendRaw.map((item: { _id: string; count: number }) => ({
			name: item._id,
			applicants: item.count,
		}));

		if (applicationsTrendData.length === 1) {
			applicationsTrendData.unshift({ name: "Start", applicants: 0 });
		} else if (applicationsTrendData.length === 0) {
			applicationsTrendData.push({ name: "Start", applicants: 0 }, { name: "End", applicants: 0 });
		}

		return {
			applicationsTrendData,
			hiringFunnelData: [
				{ stage: "Applied", count: totalApplicantsCount },
				{ stage: "Screened", count: shortlistedCount },
				{ stage: "Interviewed", count: interviewsScheduled + interviewsCompleted },
				{ stage: "Offered", count: hiredCount },
				{ stage: "Hired", count: hiredCount },
			],
			kpis: {
				activeJobs: activeJobsCount,
				activeJobsTrend: 0,
				totalApplicants: totalApplicantsCount,
				totalApplicantsTrend: 0,
				newApplicantsToday: newApplicantsTodayCount,
				newApplicantsTrend: 0,
				candidatesToReview: totalApplicantsCount - shortlistedCount - rejectedCount - hiredCount,
				interviewsToday: 0,
				offersPending: 0,
				hiredThisMonth: hiredCount,
				avgTimeToHireDays: 0,
			},
			matrix: {
				recruitmentStatus: [
					{ label: "Total Jobs", value: recruiterJobs.length.toString() },
					{ label: "Active Jobs", value: activeJobsCount.toString() },
					{ label: "Closed Jobs", value: closedJobsCount.toString() },
					{ label: "Draft Jobs", value: draftJobsCount.toString() },
				],
				candidateFunnel: [
					{ label: "Total Applicants", value: totalApplicantsCount.toString() },
					{ label: "Shortlisted Candidates", value: shortlistedCount.toString() },
					{ label: "Rejected Candidates", value: rejectedCount.toString() },
					{ label: "Hired", value: hiredCount.toString() },
				],
				interviewAnalytics: [
					{ label: "Interviews Scheduled (Pending)", value: interviewsScheduled.toString() },
					{ label: "Completed Interviews", value: interviewsCompleted.toString() },
					{ label: "Cancelled Interviews", value: interviewsCancelled.toString() },
				],
			},
		};
	}
}

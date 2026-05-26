import type { IBaseRepository } from "./base-repository.interface";

export interface JobApplicationReadModel {
	id: string;
	jobId: string;
	status: string;
	matchScore: number;
	createdAt: Date;
	updatedAt: Date;
	candidate: {
		id: string;
		name: string;
		email: string;
		phone: string | null;
		profileImage: string | null;
		profileImageKey?: string | null;
		resume: string | null;
		resumeKey?: string | null;
		bio?: string | null;
		experience?: string | null;
		skills?: string[];
	};
}

export interface IJobApplicationRepository<T> extends IBaseRepository<T> {
	findByUserAndJob(userId: string, jobId: string): Promise<T | null>;
	findByUserId(userId: string): Promise<T[]>;
	findByJobId(jobId: string): Promise<T[]>;
	findByJobIdWithPagination(jobId: string, page: number, limit: number): Promise<{ data: T[]; total: number }>;
	findApplicationsWithCandidateDetails(jobId: string, page: number, limit: number, search?: string, status?: string): Promise<{ data: JobApplicationReadModel[]; total: number }>;
}

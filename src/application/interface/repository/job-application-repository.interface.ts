import type { IBaseRepository } from "./base-repository.interface";

export interface IJobApplicationRepository<T> extends IBaseRepository<T> {
	findByUserAndJob(userId: string, jobId: string): Promise<T | null>;
}

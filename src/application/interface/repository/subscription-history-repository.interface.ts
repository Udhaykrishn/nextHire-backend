import type { IBaseRepository } from "./base-repository.interface";

export interface ISubscriptionHistoryRepository<T> extends IBaseRepository<T> {
	findByUserId(userId: string): Promise<T[] | null>;
	findPageByUserId(
		userId: string,
		page: number,
		limit: number,
	): Promise<{ data: T[]; total: number }>;
}

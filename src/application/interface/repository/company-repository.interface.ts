import { IBaseRepository } from "./base-repository.interface";

export interface ICompanyRepository<T = unknown> extends IBaseRepository<T> {
	create(data: unknown): Promise<T>;
	findAllByOwnerId(ownerId: string): Promise<T[]>;
	findById(id: string): Promise<T | null>;
	update(id: string, data: unknown): Promise<T | null>;
}

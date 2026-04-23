import { IBaseRepository } from "./base-repository.interface";

export interface IProjectRepository<T> extends IBaseRepository<T> {
	findByUserId(userId: string): Promise<T[]>;
}

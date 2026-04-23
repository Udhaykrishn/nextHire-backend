import { IBaseRepository } from "./base-repository.interface";

export interface IEducationRepository<T> extends IBaseRepository<T> {
	findByUserId(userId: string): Promise<T[]>;
}

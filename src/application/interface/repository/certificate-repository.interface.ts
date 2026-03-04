import { IBaseRepository } from "./base-repository.interface";

export interface ICertificateRepository<T> extends IBaseRepository<T> {
	findByUserId(userId: string): Promise<T[]>;
}

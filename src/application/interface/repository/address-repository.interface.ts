import { IBaseRepository } from "./base-repository.interface";

export interface IAddressRepository<T> extends IBaseRepository<T> {
	findByUserId(userId: string): Promise<T[]>;
}

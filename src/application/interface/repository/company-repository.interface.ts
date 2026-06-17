import { IBaseRepository } from "./base-repository.interface";
import type { CompanyEntity } from "@/domain/entity/company.entity";

export interface ICompanyRepository<T = CompanyEntity> extends IBaseRepository<T> {
	create(data: unknown): Promise<T>;
	findAllByOwnerId(ownerId: string): Promise<T[]>;
	findById(id: string): Promise<T | null>;
	update(id: string, data: unknown): Promise<T | null>;
}

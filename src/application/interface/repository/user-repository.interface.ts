import type {
	PaginationInputType,
	PaginationResponse,
} from "@/domain/types/paginations";
import type { IBaseRepository } from "./base-repository.interface";

export interface IUserRepository<T> extends IBaseRepository<T> {
	findAllUsers(
		pages: PaginationInputType,
	): Promise<PaginationResponse<T> | null>;
}

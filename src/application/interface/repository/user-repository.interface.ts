import type { PaginationResponse } from "@/domain/types/paginations";
import type { IBaseRepository } from "./base-repository.interface";
import type { PaginationDto } from "@/application/dto/pagiation";

export interface IUserRepository<T> extends IBaseRepository<T> {
	findAllUsers(pages: PaginationDto): Promise<PaginationResponse<T> | null>;
}

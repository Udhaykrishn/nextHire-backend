import type { IBaseRepository } from "./base-repository.interface";

export interface IAdminRepository<T> extends IBaseRepository<T> {
    // Add any admin-specific repository methods here if needed
}

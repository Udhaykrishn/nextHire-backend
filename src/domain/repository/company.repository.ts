export interface ICompanyRepository {
	create(data: unknown): Promise<unknown>;
	findAllByOwnerId(ownerId: string): Promise<unknown[]>;
	findById(id: string): Promise<unknown>;
	update(id: string, data: unknown): Promise<unknown>;
}

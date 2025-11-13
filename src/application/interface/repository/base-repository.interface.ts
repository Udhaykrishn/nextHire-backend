export interface IBaseRepository<T> {
	save(entity: T): Promise<T>;
	findById(id: string): Promise<T | null>;
	findAll(): Promise<T[]>;
	findOne(data: Partial<T>): Promise<T | null>;
	deleteById(id: string): Promise<boolean>;
	findByIdAndUpdate(id: string, update: T): Promise<T | null>;

	findByUniqueFields(fields: Partial<T>): Promise<T | null>;
}

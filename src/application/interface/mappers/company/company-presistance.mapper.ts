export interface ICompanyPresistanceMapper<Entity, Response> {
	toMongo(data: Entity): Response;
	fromMongo(data: Response): Promise<Entity> | Entity;
}

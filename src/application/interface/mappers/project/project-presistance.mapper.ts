export interface IProjectPresistanceMapper<Entity, Response> {
	toMongo(data: Entity): Response;
	fromMongo(data: Response): Promise<Entity>;
}

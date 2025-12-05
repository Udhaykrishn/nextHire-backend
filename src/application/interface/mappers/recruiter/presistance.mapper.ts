export interface IRecruiterPresitanceMapper<Entity, Response> {
	toMongo(data: Entity): Response;
	fromMongo(user: Response): Promise<Entity>;
}

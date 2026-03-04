export interface IUserPresitanceMapper<Entity, Response> {
	toMongo(data: Entity): Response;
	fromMongo(user: Response): Promise<Entity>;
}

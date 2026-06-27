export interface IInterviewerPersistenceMapper<Entity, Response> {
	toMongo(data: Entity): Response;
	fromMongo(data: Response): Promise<Entity>;
}

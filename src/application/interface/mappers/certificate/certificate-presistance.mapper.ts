export interface ICertificatePresistanceMapper<Entity, Response> {
	toMongo(data: Entity): Response;
	fromMongo(data: Response): Promise<Entity>;
}

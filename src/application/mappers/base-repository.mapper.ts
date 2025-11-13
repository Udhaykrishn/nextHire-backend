export interface IBaseMapper<TEntity, TDocument> {
	toMongo(entity: TEntity): TDocument;
	toMongo(entity: Partial<TEntity>): Partial<TDocument>;
	fromMongo(doc: TDocument): Promise<TEntity> | TEntity;
}

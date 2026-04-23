export interface IAdminPresitanceMapper<DomainEntity, MongoDoc> {
	toMongo(admin: DomainEntity): MongoDoc;
	fromMongo(doc: MongoDoc): Promise<DomainEntity>;
}

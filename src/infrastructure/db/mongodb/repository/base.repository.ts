import type { IBaseRepository } from "@/application/interface/repository";
import type { IBaseMapper } from "@/application/mappers/base-repository.mapper";
import { Injectable } from "@nestjs/common";
import type { Model, UpdateQuery } from "mongoose";

@Injectable()
export abstract class BaseRepository<TEntity, TDocument>
	implements IBaseRepository<TEntity>
{
	constructor(
		protected readonly model: Model<TDocument>,
		protected readonly mapper: IBaseMapper<TEntity, TDocument>,
	) {}

	async findOne(filter: Partial<TEntity>): Promise<TEntity | null> {
		const doc = await this.model.findOne(filter).exec();
		return doc ? this.mapper.fromMongo(doc) : null;
	}

	async save(entity: TEntity): Promise<TEntity> {
		const created = await this.model.create(this.mapper.toMongo(entity));
		return this.mapper.fromMongo(created);
	}

	async findById(id: string): Promise<TEntity | null> {
		const doc = await this.model.findById(id).exec();
		return doc ? this.mapper.fromMongo(doc) : null;
	}

	async findAll(): Promise<TEntity[]> {
		const docs = await this.model.find().exec();
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}

	async findByIdAndUpdate(
		id: string,
		updateDto: UpdateQuery<Partial<TEntity>>,
	): Promise<TEntity | null> {
		const mongoUpdate: UpdateQuery<TDocument> = this.mapper.toMongo(updateDto);


		const updatedDoc = await this.model
			.findByIdAndUpdate(id, mongoUpdate, { new: true })
			.exec();

		return updatedDoc ? this.mapper.fromMongo(updatedDoc) : null;
	}

	async deleteById(id: string): Promise<boolean> {
		const deleted = await this.model.findByIdAndDelete(id).exec();
		return !!deleted;
	}

	async findByUniqueFields(fields: Partial<TEntity>): Promise<TEntity | null> {
		const conditions = Object.entries(fields)
			.filter(([_, value]) => value !== undefined && value !== null)
			.map(([key, value]) => ({ [key]: value }));

		if (conditions.length === 0) return null;

		const doc = await this.model.findOne({ $or: conditions }).exec();
		return doc ? this.mapper.fromMongo(doc) : null;
	}
}

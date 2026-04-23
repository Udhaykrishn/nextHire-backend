import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Role, RoleDocument } from "../models/role.schema";
import { RoleEntity } from "@/domain/entity/role.entity";
import { IRoleRepository } from "@/application/interface/repository/role-repository.interface";
import { RolePresitanceMapper } from "@/infrastructure/mappers/role-presistance.mapper";

@Injectable()
export class RoleRepository implements IRoleRepository {
	private readonly mapper = new RolePresitanceMapper();

	constructor(@InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>) {}

	async findByName(name: string): Promise<RoleEntity | null> {
		const doc = await this.roleModel.findOne({ name }).populate("permissions").exec();
		return doc ? this.mapper.fromMongo(doc) : null;
	}

	async findById(id: string): Promise<RoleEntity | null> {
		const doc = await this.roleModel.findById(id).populate("permissions").exec();
		return doc ? this.mapper.fromMongo(doc) : null;
	}
}

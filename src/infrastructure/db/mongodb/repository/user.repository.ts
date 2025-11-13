import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { IUserRepository } from "@/application/interface/repository";
import { User } from "../models";
import type { Model } from "mongoose";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import type {
	PaginationInputType,
	PaginationResponse,
} from "@/domain/types/paginations";
import type { IUserPresitanceMapper } from "@/application/interface/mappers/user-presistance.mapper";
import type { UserType } from "../models/user.schema";

@Injectable()
export class UserRepository
	extends BaseRepository<UserEntity, UserType>
	implements IUserRepository<UserEntity>
{
	constructor(
		@InjectModel(User.name) private userModel: Model<UserType>,
		@Inject(USER_MAPPER.USER_PRESISTANCE)
		userPresistance: IUserPresitanceMapper<UserEntity, UserType>,
	) {
		super(userModel, userPresistance);
	}

	async findAllUsers(
		pages: PaginationInputType,
	): Promise<PaginationResponse<UserEntity> | null> {
		const docs = await this.userModel
			.find()
			.skip(pages.skip)
			.limit(pages.limit)
			.exec();
		const total = await this.userModel.countDocuments();
		const page = Math.ceil(total / pages.limit);
		const data = await Promise.all(
			docs.map((doc) => this.mapper.fromMongo(doc)),
		);

		return {
			data,
			page: page ?? 0,
			total,
		};
	}
}

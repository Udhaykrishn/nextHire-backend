import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import { AdminEntity } from "@/domain/entity";
import type { IAdminRepository } from "@/application/interface/repository";
import { Admin } from "../models";
import type { Model } from "mongoose";
import { ADMIN_MAPPER } from "@/application/enums/tokens";
import type { IAdminPresitanceMapper } from "@/application/interface/mappers/admin/admin-presistance.mapper";
import type { AdminType } from "../models/admin.schema";

@Injectable()
export class AdminRepository extends BaseRepository<AdminEntity, AdminType> implements IAdminRepository<AdminEntity> {
	constructor(
		@InjectModel(Admin.name) adminModel: Model<AdminType>,
		@Inject(ADMIN_MAPPER.ADMIN_PRESISTANCE)
		adminPresistance: IAdminPresitanceMapper<AdminEntity, AdminType>,
	) {
		super(adminModel, adminPresistance);
	}
}

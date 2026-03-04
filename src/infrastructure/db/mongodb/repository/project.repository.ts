import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import type { ProjectEntity } from "@/domain/entity/project.entity";
import type { IProjectRepository } from "@/application/interface/repository";
import { Project } from "../models";
import type { Model } from "mongoose";
import { PROJECT_MAPPER } from "@/application/enums";
import type { IProjectPresistanceMapper } from "@/application/interface/mappers/project/project-presistance.mapper";
import type { ProjectType } from "../models/project.schema";

@Injectable()
export class ProjectRepository
	extends BaseRepository<ProjectEntity, ProjectType>
	implements IProjectRepository<ProjectEntity>
{
	constructor(
		@InjectModel(Project.name) private projectModel: Model<ProjectType>,
		@Inject(PROJECT_MAPPER.PROJECT_PERSISTANCE)
		mapper: IProjectPresistanceMapper<ProjectEntity, ProjectType>,
	) {
		super(projectModel, mapper);
	}

	async findByUserId(userId: string): Promise<ProjectEntity[]> {
		const docs = await this.projectModel.find({ userId });
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}
}

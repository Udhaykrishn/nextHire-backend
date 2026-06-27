import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import { InterviewerTemplateEntity } from "@/domain/entity/interviewer-template.entity";
import type { IInterviewerTemplateRepository } from "@/application/interface/repository/interviewer-template-repository.interface";
import { InterviewerTemplate, InterviewerTemplateType } from "../models";
import { Model } from "mongoose";
import { InterviewerTemplatePersistenceMapper } from "../../../mappers/interviewer-template-persistence.mapper";

@Injectable()
export class InterviewerTemplateRepository
	extends BaseRepository<InterviewerTemplateEntity, InterviewerTemplateType>
	implements IInterviewerTemplateRepository
{
	constructor(
		@InjectModel(InterviewerTemplate.name) private templateModel: Model<InterviewerTemplateType>,
		mapper: InterviewerTemplatePersistenceMapper,
	) {
		super(templateModel, mapper);
	}

	async findByCompanyId(companyId: string): Promise<InterviewerTemplateEntity[]> {
		const docs = await this.templateModel.find({ companyId }).exec();
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}
}

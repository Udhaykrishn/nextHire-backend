import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "../base.repository";
import { InterviewerEntity } from "@/domain/entity/interviewer/interviewer.entity";
import type { IInterviewerRepository } from "@/application/interface/repository/interviewer/interviewer-repository.interface";
import { CompanyInterviewer } from "../../models";
import { Model } from "mongoose";
import { InterviewerPersistenceMapper } from "@/infrastructure/mappers/interviewer-persistence.mapper";

@Injectable()
export class InterviewerRepository
	extends BaseRepository<InterviewerEntity, CompanyInterviewer>
	implements IInterviewerRepository
{
	constructor(
		@InjectModel(CompanyInterviewer.name) private interviewerModel: Model<CompanyInterviewer>,
		mapper: InterviewerPersistenceMapper,
	) {
		super(interviewerModel, mapper);
	}

	async findByEmail(email: string): Promise<InterviewerEntity | null> {
		const doc = await this.interviewerModel.findOne({ email }).exec();
		// doc in mongoose could have _id but we typecast safely
		return doc ? this.mapper.fromMongo(doc as never) : null;
	}

	async findByCompanyId(companyId: string): Promise<InterviewerEntity[]> {
		const docs = await this.interviewerModel.find({ company_id: companyId }).exec();
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc as never)));
	}
}

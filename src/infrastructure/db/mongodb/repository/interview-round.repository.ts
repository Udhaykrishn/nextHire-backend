import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import type { IInterviewRoundRepository } from "@/application/interface/repository/interview-round-repository.interface";
import { InterviewRound, InterviewRoundType } from "../models";
import { Model } from "mongoose";
import { InterviewRoundPersistenceMapper } from "../../../mappers/interview-round-persistence.mapper";

@Injectable()
export class InterviewRoundRepository
	extends BaseRepository<InterviewRoundEntity, InterviewRoundType>
	implements IInterviewRoundRepository
{
	constructor(
		@InjectModel(InterviewRound.name) private roundModel: Model<InterviewRoundType>,
		mapper: InterviewRoundPersistenceMapper,
	) {
		super(roundModel, mapper);
	}

	async findByApplicationId(applicationId: string): Promise<InterviewRoundEntity[]> {
		const docs = await this.roundModel.find({ applicationId }).exec();
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}

	async findByInterviewerId(interviewerId: string): Promise<InterviewRoundEntity[]> {
		const docs = await this.roundModel.find({ interviewerIds: interviewerId }).exec();
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}

	async findByMeetingCode(meetingCode: string): Promise<InterviewRoundEntity | null> {
		const doc = await this.roundModel.findOne({ meetingCode }).exec();
		return doc ? this.mapper.fromMongo(doc) : null;
	}

	async findByCandidateId(candidateId: string): Promise<InterviewRoundEntity[]> {
		const appModel = this.roundModel.db.model("Application");
		const apps = await appModel.find({ userId: candidateId }).select("_id").exec();
		const appIds = apps.map((app) => app._id.toString());
		const docs = await this.roundModel.find({ applicationId: { $in: appIds } }).exec();
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}
}

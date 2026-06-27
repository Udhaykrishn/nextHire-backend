import { InterviewerEntity } from "@/domain/entity/interviewer.entity";
import type { IInterviewerPersistenceMapper } from "@/application/interface/mappers/interviewer/interviewer-persistence.mapper";
import type { CompanyInterviewer } from "../db/mongodb/models/interviewer.schema";

export class InterviewerPersistenceMapper
	implements IInterviewerPersistenceMapper<InterviewerEntity, CompanyInterviewer>
{
	toMongo(entity: InterviewerEntity): CompanyInterviewer & { _id?: string } {
		return {
			_id: entity.id,
			email: entity.email,
			created_by: entity.createdBy,
			role: entity.role,
			company_id: entity.companyId,
			password: entity.password,
			department: entity.department,
		};
	}

	async fromMongo(
		doc: CompanyInterviewer & { _id: { toString(): string }; createdAt?: Date; updatedAt?: Date },
	): Promise<InterviewerEntity> {
		return InterviewerEntity.create({
			id: doc._id.toString(),
			email: doc.email,
			createdBy: doc.created_by,
			role: doc.role,
			companyId: doc.company_id,
			password: doc.password,
			department: doc.department,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

import { InterviewerTemplateEntity } from "@/domain/entity/interviewer-template.entity";
import type { IInterviewerTemplatePersistenceMapper } from "@/application/interface/mappers/interviewer-template/interviewer-template-persistence.mapper";
import type { InterviewerTemplateType } from "../db/mongodb/models/interviewer-template.schema";

export class InterviewerTemplatePersistenceMapper
	implements IInterviewerTemplatePersistenceMapper<InterviewerTemplateEntity, InterviewerTemplateType>
{
	toMongo(entity: InterviewerTemplateEntity): InterviewerTemplateType {
		const doc = {
			companyId: entity.companyId,
			name: entity.name,
			description: entity.description,
			duration: entity.duration,
			rubric: entity.rubric,
			defaultType: entity.defaultType,
			defaultInstructions: entity.defaultInstructions,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		} as InterviewerTemplateType;

		// Only set _id when present; empty string fails ObjectId cast on create.
		if (entity.id) {
			doc._id = entity.id as string;
		}

		return doc;
	}

	async fromMongo(doc: InterviewerTemplateType): Promise<InterviewerTemplateEntity> {
		return InterviewerTemplateEntity.create({
			id: doc._id.toString(),
			companyId: doc.companyId,
			name: doc.name,
			description: doc.description,
			duration: doc.duration,
			rubric: doc.rubric,
			defaultType: doc.defaultType,
			defaultInstructions: doc.defaultInstructions,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

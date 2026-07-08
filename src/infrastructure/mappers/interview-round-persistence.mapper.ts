import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import type { IInterviewRoundPersistenceMapper } from "@/application/interface/mappers/interview-round/interview-round-persistence.mapper";
import type { InterviewRoundType } from "../db/mongodb/models/interview-round.schema";

export class InterviewRoundPersistenceMapper
	implements IInterviewRoundPersistenceMapper<InterviewRoundEntity, InterviewRoundType>
{
	toMongo(entity: InterviewRoundEntity): InterviewRoundType {
		const doc = {
			applicationId: entity.applicationId,
			interviewerIds: entity.interviewerIds,
			templateId: entity.templateId,
			title: entity.title,
			type: entity.type,
			timeZone: entity.timeZone,
			instructions: entity.instructions,
			internalNotes: entity.internalNotes,
			scheduledAt: entity.scheduledAt,
			status: entity.status,
			meetingCode: entity.meetingCode,
			duration: entity.duration,
			candidateConfirmation: entity.candidateConfirmation,
			candidateJoined: entity.candidateJoined,
			interviewerJoined: entity.interviewerJoined,
			candidateStatus: entity.candidateStatus,
			feedback: entity.feedback,
			score: entity.score,
			rubricRatings: entity.rubricRatings,
			createdAt: entity.createdAt || new Date(),
			updatedAt: entity.updatedAt || new Date(),
		} as InterviewRoundType;

		// Only set _id when present; empty string fails ObjectId cast on create.
		if (entity.id) {
			doc._id = entity.id as string;
		}

		return doc;
	}

	async fromMongo(doc: InterviewRoundType): Promise<InterviewRoundEntity> {
		// Convert rubricRatings if it's not already a standard Map
		let rubricRatingsMap: Map<string, number> | undefined;
		if (doc.rubricRatings) {
			rubricRatingsMap = new Map<string, number>();
			if (typeof doc.rubricRatings.forEach === "function") {
				doc.rubricRatings.forEach((val: number, key: string) => {
					rubricRatingsMap?.set(key, val);
				});
			} else {
				const ratingsObj = doc.rubricRatings as unknown as Record<string, number>;
				for (const [key, value] of Object.entries(ratingsObj)) {
					rubricRatingsMap.set(key, value);
				}
			}
		}

		return InterviewRoundEntity.create({
			id: doc._id.toString(),
			applicationId: doc.applicationId,
			interviewerIds: doc.interviewerIds,
			templateId: doc.templateId,
			title: doc.title,
			type: doc.type,
			timeZone: doc.timeZone,
			instructions: doc.instructions,
			internalNotes: doc.internalNotes,
			scheduledAt: doc.scheduledAt,
			status: doc.status,
			meetingCode: doc.meetingCode,
			duration: doc.duration || 45,
			candidateConfirmation: doc.candidateConfirmation || "PENDING",
			candidateJoined: doc.candidateJoined || false,
			interviewerJoined: doc.interviewerJoined || false,
			candidateStatus: doc.candidateStatus || "PENDING",
			feedback: doc.feedback,
			score: doc.score,
			rubricRatings: rubricRatingsMap,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}

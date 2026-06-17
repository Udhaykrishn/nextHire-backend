import { PlanEntity } from "@/domain/entity/plan.entity";
import type { PlanDocument } from "../db/mongodb/models/plan.schema";

export const PlanMapper = {
	toDomain(document: PlanDocument): PlanEntity {
		return new PlanEntity(
			document._id as string,
			document.name,
			document.price,
			document.description,
			document.iconType as "zap" | "crown" | "shield",
			document.features,
			document.cta,
			document.highlight,
			document.type as "candidate" | "recruiter",
			document.status as "Active" | "Archived" | "Draft" | "Inactive",
			document.subscribers,
			document.period,
			document.stripePriceId,
		);
	},

	toPersistence(entity: PlanEntity): Partial<PlanDocument> {
		return {
			name: entity.name,
			price: entity.price,
			description: entity.description,
			iconType: entity.iconType,
			features: entity.features,
			cta: entity.cta,
			highlight: entity.highlight,
			type: entity.type,
			status: entity.status,
			subscribers: entity.subscribers,
			period: entity.period,
			stripePriceId: entity.stripePriceId,
		};
	},
};

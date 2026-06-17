import type { PlanCreateData } from "@/domain/types/plan-create-data.type";

export class PlanEntity {
	constructor(
		public readonly id: string | undefined,
		public name: string,
		public price: string,
		public description: string,
		public iconType: "zap" | "crown" | "shield",
		public features: string[],
		public cta: string,
		public highlight: boolean,
		public type: "candidate" | "recruiter",
		public status: "Active" | "Archived" | "Draft" | "Inactive",
		public subscribers: number,
		public period?: string,
		public stripePriceId?: string,
		public createdAt?: Date,
		public updatedAt?: Date,
	) {}

	static create(payload: PlanCreateData) {
		return new PlanEntity(
			undefined,
			payload.name,
			payload.price,
			payload.description,
			payload.iconType,
			payload.features,
			payload.cta,
			payload.highlight,
			payload.type,
			payload.status,
			payload.subscribers,
			payload.period,
			payload.stripePriceId,
		);
	}

	update(payload: Partial<PlanCreateData>) {
		if (payload.name !== undefined) this.name = payload.name;
		if (payload.price !== undefined) this.price = payload.price;
		if (payload.description !== undefined) this.description = payload.description;
		if (payload.iconType !== undefined) this.iconType = payload.iconType;
		if (payload.features !== undefined) this.features = payload.features;
		if (payload.cta !== undefined) this.cta = payload.cta;
		if (payload.highlight !== undefined) this.highlight = payload.highlight;
		if (payload.type !== undefined) this.type = payload.type;
		if (payload.status !== undefined) this.status = payload.status;
		if (payload.subscribers !== undefined) this.subscribers = payload.subscribers;
		if (payload.period !== undefined) this.period = payload.period;
		if (payload.stripePriceId !== undefined) this.stripePriceId = payload.stripePriceId;
	}
}

export interface PlanCreateData {
	name: string;
	price: string;
	description: string;
	iconType: "zap" | "crown" | "shield";
	features: string[];
	cta: string;
	highlight: boolean;
	type: "candidate" | "recruiter";
	status: "Active" | "Archived" | "Draft" | "Inactive";
	subscribers: number;
	period?: string;
	stripePriceId?: string;
}

import { IsString, IsArray, IsBoolean, IsIn, IsOptional } from "class-validator";

export class CreatePlanDto {
	@IsString()
	name: string;

	@IsString()
	price: string;

	@IsOptional()
	@IsString()
	period?: string;

	@IsString()
	description: string;

	@IsIn(["zap", "crown", "shield"])
	iconType: "zap" | "crown" | "shield";

	@IsArray()
	@IsString({ each: true })
	features: string[];

	@IsString()
	cta: string;

	@IsBoolean()
	highlight: boolean;

	@IsIn(["candidate", "recruiter"])
	type: "candidate" | "recruiter";

	@IsOptional()
	@IsIn(["Active", "Archived", "Draft", "Inactive"])
	status?: "Active" | "Archived" | "Draft" | "Inactive";

	@IsOptional()
	@IsString()
	stripePriceId?: string;
}

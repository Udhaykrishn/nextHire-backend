import { IsArray, IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";

export class CreateJobDto {
	@IsString()
	@IsNotEmpty()
	job_title: string;

	@IsString()
	@IsNotEmpty()
	job_description: string;

	@IsString()
	@IsOptional()
	job_logo?: string;

	@IsString()
	@IsOptional()
	work_mode?: string;

	@IsArray()
	@IsOptional()
	job_requirements?: { requirement: string; title: string }[];

	@IsString()
	@IsOptional()
	job_shift?: string;

	@IsObject()
	@IsOptional()
	walk_in_interview?: {
		additions: string;
		document_carry: string[];
		interview_date: string;
		interview_location: string;
		interview_mode: string;
		is_active: boolean;
	};

	@IsString()
	@IsNotEmpty()
	company_id: string; // recruiterId

	@IsObject()
	@IsOptional()
	salary?: { max: string; min: string };

	@IsArray()
	@IsOptional()
	job_role_department?: string[];

	@IsArray()
	@IsOptional()
	requirement_ats?: { fields: string; title: string }[];

	@IsString()
	@IsNotEmpty()
	posted_by: string; // recruiter email or name

	@IsString()
	@IsOptional()
	job_highlights?: string;

	@IsString()
	@IsOptional()
	status?: string;

	@IsBoolean()
	@IsOptional()
	is_published?: boolean;

	@IsString()
	@IsOptional()
	job_type?: string;
}

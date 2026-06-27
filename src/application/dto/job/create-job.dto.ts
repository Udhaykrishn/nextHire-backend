import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateJobDto {
	// Step 1
	@IsString()
	@IsOptional()
	belongingCompany?: string;

	@IsString()
	@IsNotEmpty()
	hiringCompany: string;

	@IsString()
	@IsNotEmpty()
	experienceType: string;

	@IsString()
	@IsNotEmpty()
	jobTitle: string;

	@IsString()
	@IsNotEmpty()
	jobCategory: string;

	@IsString()
	@IsNotEmpty()
	jobType: string;

	@IsBoolean()
	@IsOptional()
	isNightShift?: boolean;

	@IsString()
	@IsOptional()
	locationType?: string;

	@IsString()
	@IsOptional()
	officeAddress?: string;

	@IsString()
	@IsOptional()
	fieldArea?: string;

	@IsString()
	@IsOptional()
	jobCity?: string;

	@IsString()
	@IsOptional()
	floorDetails?: string;

	@IsBoolean()
	@IsOptional()
	showFloorDetails?: boolean;

	@IsArray()
	@IsOptional()
	industry?: string[];

	// Step 2
	@IsString()
	@IsOptional()
	payType?: string;

	@IsString()
	@IsOptional()
	minSalary?: string;

	@IsString()
	@IsOptional()
	maxSalary?: string;

	@IsString()
	@IsOptional()
	incentiveAmount?: string;

	@IsArray()
	@IsOptional()
	perks?: string[];

	@IsString()
	@IsOptional()
	hasJoiningFee?: string;

	@IsString()
	@IsOptional()
	feeAmount?: string;

	@IsString()
	@IsOptional()
	feeReason?: string;

	@IsString()
	@IsOptional()
	feeDetails?: string;

	@IsString()
	@IsOptional()
	feePaymentTiming?: string;

	@IsString()
	@IsOptional()
	gender?: string;

	@IsString()
	@IsOptional()
	minAge?: string;

	@IsString()
	@IsOptional()
	maxAge?: string;

	@IsString()
	@IsOptional()
	education?: string;

	@IsArray()
	@IsOptional()
	degreeSpecialization?: string[];

	@IsArray()
	@IsOptional()
	regionalLanguages?: string[];

	@IsArray()
	@IsOptional()
	skills?: string[];

	@IsString()
	@IsOptional()
	englishLevel?: string;

	@IsString()
	@IsOptional()
	experience?: string;

	@IsString()
	@IsOptional()
	minExperience?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsString()
	@IsOptional()
	jobDescription?: string;

	// Step 3
	@IsBoolean()
	@IsOptional()
	isWalkIn?: boolean;

	@IsString()
	@IsOptional()
	interviewAddress?: string;

	@IsString()
	@IsOptional()
	walkInStartDate?: string;

	@IsString()
	@IsOptional()
	walkInEndDate?: string;

	@IsString()
	@IsOptional()
	walkInStartTime?: string;

	@IsString()
	@IsOptional()
	walkInEndTime?: string;

	@IsString()
	@IsOptional()
	interviewInstructions?: string;

	@IsString()
	@IsOptional()
	contactPreference?: string;

	@IsString()
	@IsOptional()
	hrName?: string;

	@IsString()
	@IsOptional()
	hrPhone?: string;

	@IsString()
	@IsOptional()
	hrEmail?: string;

	@IsString()
	@IsOptional()
	otherRecruiterName?: string;

	@IsString()
	@IsOptional()
	otherRecruiterWhatsapp?: string;

	@IsString()
	@IsOptional()
	otherRecruiterEmail?: string;

	@IsString()
	@IsOptional()
	canCandidateContact?: string;

	@IsString()
	@IsOptional()
	whatsappAlerts?: string;

	// Step 5
	@IsString()
	@IsOptional()
	selectedPlan?: string;

	// Metadata
	@IsString()
	@IsOptional()
	company_id?: string;

	@IsString()
	@IsOptional()
	posted_by?: string;

	@IsString()
	@IsOptional()
	status?: string;

	@IsBoolean()
	@IsOptional()
	is_chat_enabled?: boolean;

	@IsBoolean()
	@IsOptional()
	is_published?: boolean;
}

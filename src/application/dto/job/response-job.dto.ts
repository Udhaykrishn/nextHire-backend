import { Expose } from "class-transformer";

export class ResponseJobDto {
	@Expose()
	id: string;

	@Expose()
	belongingCompany: string;

	@Expose()
	hiringCompany: string;

	@Expose()
	experienceType: string;

	@Expose()
	jobTitle: string;

	@Expose()
	jobCategory: string;

	@Expose()
	jobType: string;

	@Expose()
	isNightShift: boolean;

	@Expose()
	locationType: string;

	@Expose()
	officeAddress: string;

	@Expose()
	fieldArea: string;

	@Expose()
	jobCity: string;

	@Expose()
	floorDetails: string;

	@Expose()
	showFloorDetails: boolean;

	@Expose()
	industry: string[];

	@Expose()
	payType: string;

	@Expose()
	minSalary: string;

	@Expose()
	maxSalary: string;

	@Expose()
	incentiveAmount: string;

	@Expose()
	perks: string[];

	@Expose()
	hasJoiningFee: string;

	@Expose()
	feeAmount: string;

	@Expose()
	feeReason: string;

	@Expose()
	feeDetails: string;

	@Expose()
	feePaymentTiming: string;

	@Expose()
	gender: string;

	@Expose()
	minAge: string;

	@Expose()
	maxAge: string;

	@Expose()
	education: string;

	@Expose()
	degreeSpecialization: string[];

	@Expose()
	regionalLanguages: string[];

	@Expose()
	skills: string[];

	@Expose()
	englishLevel: string;

	@Expose()
	experience: string;

	@Expose()
	minExperience: string;

	@Expose()
	description: string;

	@Expose()
	jobDescription: string;

	@Expose()
	isWalkIn: boolean;

	@Expose()
	interviewAddress: string;

	@Expose()
	walkInStartDate: string;

	@Expose()
	walkInEndDate: string;

	@Expose()
	walkInStartTime: string;

	@Expose()
	walkInEndTime: string;

	@Expose()
	interviewInstructions: string;

	@Expose()
	contactPreference: string;

	@Expose()
	hrName: string;

	@Expose()
	hrPhone: string;

	@Expose()
	hrEmail: string;

	@Expose()
	otherRecruiterName: string;

	@Expose()
	otherRecruiterWhatsapp: string;

	@Expose()
	otherRecruiterEmail: string;

	@Expose()
	canCandidateContact: string;

	@Expose()
	whatsappAlerts: string;

	@Expose()
	selectedPlan: string;

	@Expose()
	created_at: string;

	@Expose()
	updated_at: string;

	@Expose()
	status: string;

	@Expose()
	company_id: string;

	@Expose()
	posted_by: string;

	@Expose()
	is_published: boolean;
}

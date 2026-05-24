import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import type { HydratedDocument, InferSchemaType } from "mongoose";

export type JobsDocument = HydratedDocument<Jobs>;

@Schema({ timestamps: true })
export class Jobs {
	// Step 1
	@Prop({ type: String, default: null })
	belongingCompany: string | null;

	@Prop({ type: String, default: null })
	hiringCompany: string | null;

	@Prop({ type: String, default: null })
	companyLogo: string | null;

	@Prop({ type: String, default: null })
	experienceType: string | null;

	@Prop({ type: String, default: null })
	jobTitle: string | null;

	@Prop({ type: String, default: null })
	jobCategory: string | null;

	@Prop({ type: String, default: null })
	jobType: string | null;

	@Prop({ type: Boolean, default: false })
	isNightShift: boolean;

	@Prop({ type: String, default: null })
	locationType: string | null;

	@Prop({ type: String, default: null })
	officeAddress: string | null;

	@Prop({ type: String, default: null })
	fieldArea: string | null;

	@Prop({ type: String, default: null })
	jobCity: string | null;

	@Prop({ type: String, default: null })
	floorDetails: string | null;

	@Prop({ type: Boolean, default: false })
	showFloorDetails: boolean;

	@Prop({ type: [String], default: [] })
	industry: string[];

	// Step 2
	@Prop({ type: String, default: null })
	payType: string | null;

	@Prop({ type: String, default: null })
	minSalary: string | null;

	@Prop({ type: String, default: null })
	maxSalary: string | null;

	@Prop({ type: String, default: null })
	incentiveAmount: string | null;

	@Prop({ type: [String], default: [] })
	perks: string[];

	@Prop({ type: String, default: null })
	hasJoiningFee: string | null;

	@Prop({ type: String, default: null })
	feeAmount: string | null;

	@Prop({ type: String, default: null })
	feeReason: string | null;

	@Prop({ type: String, default: null })
	feeDetails: string | null;

	@Prop({ type: String, default: null })
	feePaymentTiming: string | null;

	@Prop({ type: String, default: null })
	gender: string | null;

	@Prop({ type: String, default: null })
	minAge: string | null;

	@Prop({ type: String, default: null })
	maxAge: string | null;

	@Prop({ type: String, default: null })
	education: string | null;

	@Prop({ type: [String], default: [] })
	degreeSpecialization: string[];

	@Prop({ type: [String], default: [] })
	regionalLanguages: string[];

	@Prop({ type: [String], default: [] })
	skills: string[];

	@Prop({ type: String, default: null })
	englishLevel: string | null;

	@Prop({ type: String, default: null })
	experience: string | null;

	@Prop({ type: String, default: null })
	minExperience: string | null;

	@Prop({ type: String, default: null })
	description: string | null;

	@Prop({ type: String, default: null })
	jobDescription: string | null;

	// Step 3
	@Prop({ type: Boolean, default: false })
	isWalkIn: boolean;

	@Prop({ type: String, default: null })
	interviewAddress: string | null;

	@Prop({ type: String, default: null })
	walkInStartDate: string | null;

	@Prop({ type: String, default: null })
	walkInEndDate: string | null;

	@Prop({ type: String, default: null })
	walkInStartTime: string | null;

	@Prop({ type: String, default: null })
	walkInEndTime: string | null;

	@Prop({ type: String, default: null })
	interviewInstructions: string | null;

	@Prop({ type: String, default: null })
	contactPreference: string | null;

	@Prop({ type: String, default: null })
	hrName: string | null;

	@Prop({ type: String, default: null })
	hrPhone: string | null;

	@Prop({ type: String, default: null })
	hrEmail: string | null;

	@Prop({ type: String, default: null })
	otherRecruiterName: string | null;

	@Prop({ type: String, default: null })
	otherRecruiterWhatsapp: string | null;

	@Prop({ type: String, default: null })
	otherRecruiterEmail: string | null;

	@Prop({ type: String, default: "No" })
	canCandidateContact: string;

	@Prop({ type: String, default: null })
	whatsappAlerts: string | null;

	// Step 5
	@Prop({ type: String, default: null })
	selectedPlan: string | null;

	// Common metadata
	@Prop({ type: String, default: null })
	company_id: string | null;

	@Prop({ type: String, default: null })
	posted_by: string | null;

	@Prop({ type: String, default: "OPEN" })
	status: string | null;

	@Prop({ type: Boolean, default: false })
	is_published: boolean;

	@Prop({ type: String, default: null })
	created_at: string | null;

	@Prop({ type: String, default: null })
	updated_at: string | null;
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);
export type JobType = InferSchemaType<typeof JobsSchema> & { _id: string };

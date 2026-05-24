import { JobEntity } from "@/domain/entity/job.entity";

export function toJobResponse(job: JobEntity) {
	return {
		id: job.id,
		belongingCompany: job.belongingCompany,
		hiringCompany: job.hiringCompany,
		companyLogo: job.companyLogo,
		experienceType: job.experienceType,
		jobTitle: job.jobTitle,
		jobCategory: job.jobCategory,
		jobType: job.jobType,
		isNightShift: job.isNightShift,
		locationType: job.locationType,
		officeAddress: job.officeAddress,
		fieldArea: job.fieldArea,
		jobCity: job.jobCity,
		floorDetails: job.floorDetails,
		showFloorDetails: job.showFloorDetails,
		industry: job.industry,
		payType: job.payType,
		minSalary: job.minSalary,
		maxSalary: job.maxSalary,
		incentiveAmount: job.incentiveAmount,
		perks: job.perks,
		hasJoiningFee: job.hasJoiningFee,
		feeAmount: job.feeAmount,
		feeReason: job.feeReason,
		feeDetails: job.feeDetails,
		feePaymentTiming: job.feePaymentTiming,
		gender: job.gender,
		minAge: job.minAge,
		maxAge: job.maxAge,
		education: job.education,
		degreeSpecialization: job.degreeSpecialization,
		regionalLanguages: job.regionalLanguages,
		skills: job.skills,
		englishLevel: job.englishLevel,
		experience: job.experience,
		minExperience: job.minExperience,
		description: job.description,
		jobDescription: job.jobDescription,
		isWalkIn: job.isWalkIn,
		interviewAddress: job.interviewAddress,
		walkInStartDate: job.walkInStartDate,
		walkInEndDate: job.walkInEndDate,
		walkInStartTime: job.walkInStartTime,
		walkInEndTime: job.walkInEndTime,
		interviewInstructions: job.interviewInstructions,
		contactPreference: job.contactPreference,
		hrName: job.hrName,
		hrPhone: job.hrPhone,
		hrEmail: job.hrEmail,
		otherRecruiterName: job.otherRecruiterName,
		otherRecruiterWhatsapp: job.otherRecruiterWhatsapp,
		otherRecruiterEmail: job.otherRecruiterEmail,
		canCandidateContact: job.canCandidateContact,
		whatsappAlerts: job.whatsappAlerts,
		selectedPlan: job.selectedPlan,
		company_id: job.company_id,
		posted_by: job.posted_by,
		status: job.status,
		is_published: job.is_published,
		created_at: job.created_at,
		updated_at: job.updated_at,
	};
}

export function toJobResponseWithScore(jobWithScore: JobEntity & { matchScore?: number }) {
	const response = toJobResponse(jobWithScore) as Record<string, unknown>;
	if (jobWithScore.matchScore !== undefined) {
		response.matchScore = jobWithScore.matchScore;
	}
	return response;
}


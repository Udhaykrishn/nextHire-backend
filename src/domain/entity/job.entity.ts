import { JOB_STATUS } from "../enums/status";

export interface IJobEntityData {
	id?: string;

	// Step 1
	belongingCompany: string;
	hiringCompany: string;
	companyLogo?: string;
	experienceType: string;
	jobTitle: string;
	jobCategory: string;
	jobType: string;
	isNightShift: boolean;
	locationType: string;
	officeAddress: string;
	fieldArea: string;
	jobCity: string;
	floorDetails: string;
	showFloorDetails: boolean;
	industry: string[];

	// Step 2
	payType: string;
	minSalary: string;
	maxSalary: string;
	incentiveAmount: string;
	perks: string[];
	hasJoiningFee: string;
	feeAmount: string;
	feeReason: string;
	feeDetails: string;
	feePaymentTiming: string;
	gender: string;
	minAge: string;
	maxAge: string;
	education: string;
	degreeSpecialization: string[];
	regionalLanguages: string[];
	skills: string[];
	englishLevel: string;
	experience: string;
	minExperience: string;
	description: string;
	jobDescription: string;

	// Step 3
	isWalkIn: boolean;
	interviewAddress: string;
	walkInStartDate: string;
	walkInEndDate: string;
	walkInStartTime: string;
	walkInEndTime: string;
	interviewInstructions: string;
	contactPreference: string;
	hrName: string;
	hrPhone: string;
	hrEmail: string;
	otherRecruiterName: string;
	otherRecruiterWhatsapp: string;
	otherRecruiterEmail: string;
	canCandidateContact: string;
	whatsappAlerts: string;

	// Step 5
	selectedPlan: string;

	// Metadata
	company_id: string;
	posted_by: string;
	status: string;
	is_published: boolean;
	created_at: string;
	updated_at: string;
}

export class JobEntity {
	private readonly _id?: string;

	// Step 1
	private _belongingCompany: string;
	private _hiringCompany: string;
	private _companyLogo?: string;
	private _experienceType: string;
	private _jobTitle: string;
	private _jobCategory: string;
	private _jobType: string;
	private _isNightShift: boolean;
	private _locationType: string;
	private _officeAddress: string;
	private _fieldArea: string;
	private _jobCity: string;
	private _floorDetails: string;
	private _showFloorDetails: boolean;
	private _industry: string[];

	// Step 2
	private _payType: string;
	private _minSalary: string;
	private _maxSalary: string;
	private _incentiveAmount: string;
	private _perks: string[];
	private _hasJoiningFee: string;
	private _feeAmount: string;
	private _feeReason: string;
	private _feeDetails: string;
	private _feePaymentTiming: string;
	private _gender: string;
	private _minAge: string;
	private _maxAge: string;
	private _education: string;
	private _degreeSpecialization: string[];
	private _regionalLanguages: string[];
	private _skills: string[];
	private _englishLevel: string;
	private _experience: string;
	private _minExperience: string;
	private _description: string;
	private _jobDescription: string;

	// Step 3
	private _isWalkIn: boolean;
	private _interviewAddress: string;
	private _walkInStartDate: string;
	private _walkInEndDate: string;
	private _walkInStartTime: string;
	private _walkInEndTime: string;
	private _interviewInstructions: string;
	private _contactPreference: string;
	private _hrName: string;
	private _hrPhone: string;
	private _hrEmail: string;
	private _otherRecruiterName: string;
	private _otherRecruiterWhatsapp: string;
	private _otherRecruiterEmail: string;
	private _canCandidateContact: string;
	private _whatsappAlerts: string;

	// Step 5
	private _selectedPlan: string;

	// Metadata
	private _company_id: string;
	private _posted_by: string;
	private _status: string;
	private _is_published: boolean;
	private _created_at: string;
	private _updated_at: string;

	private constructor(data: IJobEntityData) {
		this._id = data.id;

		this._belongingCompany = data.belongingCompany;
		this._hiringCompany = data.hiringCompany;
		this._companyLogo = data.companyLogo;
		this._experienceType = data.experienceType;
		this._jobTitle = data.jobTitle;
		this._jobCategory = data.jobCategory;
		this._jobType = data.jobType;
		this._isNightShift = data.isNightShift;
		this._locationType = data.locationType;
		this._officeAddress = data.officeAddress;
		this._fieldArea = data.fieldArea;
		this._jobCity = data.jobCity;
		this._floorDetails = data.floorDetails;
		this._showFloorDetails = data.showFloorDetails;
		this._industry = data.industry;

		this._payType = data.payType;
		this._minSalary = data.minSalary;
		this._maxSalary = data.maxSalary;
		this._incentiveAmount = data.incentiveAmount;
		this._perks = data.perks;
		this._hasJoiningFee = data.hasJoiningFee;
		this._feeAmount = data.feeAmount;
		this._feeReason = data.feeReason;
		this._feeDetails = data.feeDetails;
		this._feePaymentTiming = data.feePaymentTiming;
		this._gender = data.gender;
		this._minAge = data.minAge;
		this._maxAge = data.maxAge;
		this._education = data.education;
		this._degreeSpecialization = data.degreeSpecialization;
		this._regionalLanguages = data.regionalLanguages;
		this._skills = data.skills;
		this._englishLevel = data.englishLevel;
		this._experience = data.experience;
		this._minExperience = data.minExperience;
		this._description = data.description;
		this._jobDescription = data.jobDescription;

		this._isWalkIn = data.isWalkIn;
		this._interviewAddress = data.interviewAddress;
		this._walkInStartDate = data.walkInStartDate;
		this._walkInEndDate = data.walkInEndDate;
		this._walkInStartTime = data.walkInStartTime;
		this._walkInEndTime = data.walkInEndTime;
		this._interviewInstructions = data.interviewInstructions;
		this._contactPreference = data.contactPreference;
		this._hrName = data.hrName;
		this._hrPhone = data.hrPhone;
		this._hrEmail = data.hrEmail;
		this._otherRecruiterName = data.otherRecruiterName;
		this._otherRecruiterWhatsapp = data.otherRecruiterWhatsapp;
		this._otherRecruiterEmail = data.otherRecruiterEmail;
		this._canCandidateContact = data.canCandidateContact;
		this._whatsappAlerts = data.whatsappAlerts;

		this._selectedPlan = data.selectedPlan;

		this._company_id = data.company_id;
		this._posted_by = data.posted_by;
		this._status = data.status;
		this._is_published = data.is_published;
		this._created_at = data.created_at;
		this._updated_at = data.updated_at;
	}

	static create(
		data: Partial<IJobEntityData> & {
			hiringCompany: string;
			companyLogo?: string;
			jobTitle: string;
			experienceType: string;
			jobCategory: string;
			jobType: string;
			company_id: string;
			posted_by: string;
		},
	): JobEntity {
		const fullData: IJobEntityData = {
			belongingCompany: data.belongingCompany || "",
			hiringCompany: data.hiringCompany,
			companyLogo: data.companyLogo || "",
			experienceType: data.experienceType,
			jobTitle: data.jobTitle,
			jobCategory: data.jobCategory,
			jobType: data.jobType,
			isNightShift: data.isNightShift || false,
			locationType: data.locationType || "",
			officeAddress: data.officeAddress || "",
			fieldArea: data.fieldArea || "",
			jobCity: data.jobCity || "",
			floorDetails: data.floorDetails || "",
			showFloorDetails: data.showFloorDetails || false,
			industry: data.industry || [],
			payType: data.payType || "",
			minSalary: data.minSalary || "",
			maxSalary: data.maxSalary || "",
			incentiveAmount: data.incentiveAmount || "",
			perks: data.perks || [],
			hasJoiningFee: data.hasJoiningFee || "No",
			feeAmount: data.feeAmount || "",
			feeReason: data.feeReason || "",
			feeDetails: data.feeDetails || "",
			feePaymentTiming: data.feePaymentTiming || "",
			gender: data.gender || "",
			minAge: data.minAge || "",
			maxAge: data.maxAge || "",
			education: data.education || "",
			degreeSpecialization: data.degreeSpecialization || [],
			regionalLanguages: data.regionalLanguages || [],
			skills: data.skills || [],
			englishLevel: data.englishLevel || "",
			experience: data.experience || "",
			minExperience: data.minExperience || "",
			description: data.description || "",
			jobDescription: data.jobDescription || "",
			isWalkIn: data.isWalkIn || false,
			interviewAddress: data.interviewAddress || "",
			walkInStartDate: data.walkInStartDate || "",
			walkInEndDate: data.walkInEndDate || "",
			walkInStartTime: data.walkInStartTime || "",
			walkInEndTime: data.walkInEndTime || "",
			interviewInstructions: data.interviewInstructions || "",
			contactPreference: data.contactPreference || "",
			hrName: data.hrName || "",
			hrPhone: data.hrPhone || "",
			hrEmail: data.hrEmail || "",
			otherRecruiterName: data.otherRecruiterName || "",
			otherRecruiterWhatsapp: data.otherRecruiterWhatsapp || "",
			otherRecruiterEmail: data.otherRecruiterEmail || "",
			canCandidateContact: data.canCandidateContact || "No",
			whatsappAlerts: data.whatsappAlerts || "",
			selectedPlan: data.selectedPlan || "",
			company_id: data.company_id,
			posted_by: data.posted_by,
			status: data.status || JOB_STATUS.OPEN,
			is_published: data.is_published || false,
			created_at: data.created_at || new Date().toISOString(),
			updated_at: data.updated_at || new Date().toISOString(),
			id: data.id,
		};
		return new JobEntity(fullData);
	}

	// Getters
	get id(): string | undefined {
		return this._id;
	}

	get belongingCompany(): string {
		return this._belongingCompany;
	}
	get hiringCompany(): string {
		return this._hiringCompany;
	}
	get companyLogo(): string | undefined {
		return this._companyLogo;
	}
	get experienceType(): string {
		return this._experienceType;
	}
	get jobTitle(): string {
		return this._jobTitle;
	}
	get jobCategory(): string {
		return this._jobCategory;
	}
	get jobType(): string {
		return this._jobType;
	}
	get isNightShift(): boolean {
		return this._isNightShift;
	}
	get locationType(): string {
		return this._locationType;
	}
	get officeAddress(): string {
		return this._officeAddress;
	}
	get fieldArea(): string {
		return this._fieldArea;
	}
	get jobCity(): string {
		return this._jobCity;
	}
	get floorDetails(): string {
		return this._floorDetails;
	}
	get showFloorDetails(): boolean {
		return this._showFloorDetails;
	}
	get industry(): string[] {
		return this._industry;
	}

	get payType(): string {
		return this._payType;
	}
	get minSalary(): string {
		return this._minSalary;
	}
	get maxSalary(): string {
		return this._maxSalary;
	}
	get incentiveAmount(): string {
		return this._incentiveAmount;
	}
	get perks(): string[] {
		return this._perks;
	}
	get hasJoiningFee(): string {
		return this._hasJoiningFee;
	}
	get feeAmount(): string {
		return this._feeAmount;
	}
	get feeReason(): string {
		return this._feeReason;
	}
	get feeDetails(): string {
		return this._feeDetails;
	}
	get feePaymentTiming(): string {
		return this._feePaymentTiming;
	}
	get gender(): string {
		return this._gender;
	}
	get minAge(): string {
		return this._minAge;
	}
	get maxAge(): string {
		return this._maxAge;
	}
	get education(): string {
		return this._education;
	}
	get degreeSpecialization(): string[] {
		return this._degreeSpecialization;
	}
	get regionalLanguages(): string[] {
		return this._regionalLanguages;
	}
	get skills(): string[] {
		return this._skills;
	}
	get englishLevel(): string {
		return this._englishLevel;
	}
	get experience(): string {
		return this._experience;
	}
	get minExperience(): string {
		return this._minExperience;
	}
	get description(): string {
		return this._description;
	}
	get jobDescription(): string {
		return this._jobDescription;
	}

	get isWalkIn(): boolean {
		return this._isWalkIn;
	}
	get interviewAddress(): string {
		return this._interviewAddress;
	}
	get walkInStartDate(): string {
		return this._walkInStartDate;
	}
	get walkInEndDate(): string {
		return this._walkInEndDate;
	}
	get walkInStartTime(): string {
		return this._walkInStartTime;
	}
	get walkInEndTime(): string {
		return this._walkInEndTime;
	}
	get interviewInstructions(): string {
		return this._interviewInstructions;
	}
	get contactPreference(): string {
		return this._contactPreference;
	}
	get hrName(): string {
		return this._hrName;
	}
	get hrPhone(): string {
		return this._hrPhone;
	}
	get hrEmail(): string {
		return this._hrEmail;
	}
	get otherRecruiterName(): string {
		return this._otherRecruiterName;
	}
	get otherRecruiterWhatsapp(): string {
		return this._otherRecruiterWhatsapp;
	}
	get otherRecruiterEmail(): string {
		return this._otherRecruiterEmail;
	}
	get canCandidateContact(): string {
		return this._canCandidateContact;
	}
	get whatsappAlerts(): string {
		return this._whatsappAlerts;
	}

	get selectedPlan(): string {
		return this._selectedPlan;
	}

	get company_id(): string {
		return this._company_id;
	}
	get posted_by(): string {
		return this._posted_by;
	}
	get status(): string {
		return this._status;
	}
	changeStatus(status: string): void {
		this._status = status;
	}
	get is_published(): boolean {
		return this._is_published;
	}
	get created_at(): string {
		return this._created_at;
	}
	get updated_at(): string {
		return this._updated_at;
	}
}

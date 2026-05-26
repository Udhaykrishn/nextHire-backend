import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { JOB_TOKEN, USERS_TOKEN, COMMON_TOKEN } from "@/application/enums/tokens";
import { JOB_MESSAGES } from "@/domain/enums/messages/job-message.enum";
import { USER_MESSAGES } from "@/domain/enums/messages/user-error-message.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { IJobApplicationRepository, IJobRepository, IUserRepository } from "@/application/interface/repository";
import type { IAiService } from "@/infrastructure/services/interface/ai-service.interface";
import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";
import type { IPdfParserService } from "@/infrastructure/services/interface";

export interface CalculateMatchScoreDto {
	jobId: string;
	candidateId: string;
	retry?: boolean;
}

@Injectable()
export class CalculateMatchScoreUseCase
	implements IExecutable<CalculateMatchScoreDto, { matchScore: number; breakdown: Record<string, unknown> }> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<any>,
		@Inject(COMMON_TOKEN.AI_SERVICE)
		private readonly _aiService: IAiService,
		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
		@Inject(COMMON_TOKEN.PDF_PARSER_SERVICE)
		private readonly _pdfParserService: IPdfParserService,
	) { }

	async execute(dto: CalculateMatchScoreDto): Promise<{ matchScore: number; breakdown: Record<string, unknown> }> {
		const job = await this._jobRepository.findById(dto.jobId);
		if (!job) {
			throw new NotFoundException(JOB_MESSAGES.JOB_NOT_FOUND);
		}

		const user = await this._userRepository.findById(dto.candidateId);
		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		// Check if we already have an application and a stored match score
		const application = await this._jobApplicationRepository.findByUserAndJob(user.id as string, job.id as string);
		if (application && application.matchScore > 0 && application.matchBreakdown && !dto.retry) {
			return { matchScore: application.matchScore, breakdown: application.matchBreakdown };
		}

		let parsedResumeText = "";
		try {
			if (user.resume_url?.key) {
				const signedUrl = await this._s3Service.getSignedUrlForRead(user.resume_url.key);
				const response = await fetch(signedUrl);
				if (response.ok) {
					const buffer = await response.arrayBuffer();
					parsedResumeText = await this._pdfParserService.parsePdfFromBuffer(Buffer.from(buffer));
				}
			} else if (user.resume_url?.url) {
				const response = await fetch(user.resume_url.url);
				if (response.ok) {
					const buffer = await response.arrayBuffer();
					parsedResumeText = await this._pdfParserService.parsePdfFromBuffer(Buffer.from(buffer));
				}
			}
		} catch (err) {
			console.error("Failed to parse resume PDF:", err);
		}

		try {
			const prompt = `
You are an expert technical recruiter and AI matching system.
Evaluate the candidate's profile AND RESUME against the job description and return ONLY a valid JSON object.

JOB DETAILS:
Title: ${job.jobTitle}
Description: ${job.jobDescription}
Skills Required: ${job.skills?.join(", ")}
Min Experience: ${job.minExperience} years
Languages: ${job.regionalLanguages?.join(", ")}

CANDIDATE DETAILS:
Name: ${user.name}
Bio/About: ${user.bio || "None"}
Skills: ${user.skills?.join(", ")}
Experience: ${user.experience || "0"} years
Languages: ${user.languages?.map(l => l.name).join(", ")}

CANDIDATE PARSED RESUME:
${parsedResumeText.substring(0, 5000)}

Task:
Calculate a match score (0-100) based on how well the candidate fits the job requirements.
Extract the main matched keywords from both the profile/resume and job description.
Provide brief recruiter notes explaining why this score was given, highlighting strengths and weaknesses.

You must return ONLY the following JSON structure, with no markdown formatting, no backticks, and no extra text:
{
  "matchScore": 85,
  "breakdown": {
    "keywords": ["React", "Node.js", "5 years experience"],
    "notes": "Candidate has strong matching skills but slightly less experience than requested."
  }
}
`;
			const responseText = await this._aiService.generateContent(prompt);

			const jsonMatch = responseText.match(/\{[\s\S]*\}/);
			if (!jsonMatch) {
				throw new Error(`No JSON found in response: ${responseText}`);
			}
			const parsed = JSON.parse(jsonMatch[0]);

			const matchScore = parsed.matchScore || 0;
			const breakdown = parsed.breakdown || { keywords: [], notes: "Analysis completed." };

			if (application && application.id) {
				application.changeMatchScore(matchScore);
				application.changeMatchBreakdown(breakdown);
				await this._jobApplicationRepository.findByIdAndUpdate(application.id, application as any);
			}

			return {
				matchScore,
				breakdown
			};

		} catch (error) {
			console.error("AI Match generation failed", error);
			const fallback = this.calculateManualMatchScore(user, job);
			fallback.breakdown.notes = "Error: " + (error?.message || String(error));
			return fallback;
		}
	}

	private calculateManualMatchScore(user: UserEntity, job: JobEntity): { matchScore: number; breakdown: any } {
		let skillScore = 100;
		let matchedKeywords: string[] = [];
		if (job.skills && job.skills.length > 0) {
			const jobSkills = job.skills.map((s) => s.trim().toLowerCase());
			const userSkills = (user.skills || []).map((s) => s.trim().toLowerCase());
			const matchedSkills = jobSkills.filter((s) => userSkills.includes(s));
			matchedKeywords = [...matchedSkills];
			skillScore = (matchedSkills.length / jobSkills.length) * 100;
		}

		let experienceScore = 100;
		const jobMinExp = parseFloat(job.minExperience || "0") || 0;
		if (jobMinExp > 0) {
			const userExp = parseFloat(user.experience || "0") || 0;
			if (userExp >= jobMinExp) {
				experienceScore = 100;
			} else {
				experienceScore = (userExp / jobMinExp) * 100;
			}
		}

		let languageScore = 100;
		if (job.regionalLanguages && job.regionalLanguages.length > 0) {
			const jobLanguages = job.regionalLanguages.map((l) => l.trim().toLowerCase());
			const userLanguages = (user.languages || []).map((l) => l.name.trim().toLowerCase());
			const matchedLanguages = jobLanguages.filter((l) => userLanguages.includes(l));
			languageScore = (matchedLanguages.length / jobLanguages.length) * 100;
		}

		const overallScore = skillScore * 0.6 + experienceScore * 0.3 + languageScore * 0.1;

		return {
			matchScore: Math.round(overallScore),
			breakdown: {
				keywords: matchedKeywords.length > 0 ? matchedKeywords : ["Basic matching"],
				notes: "Manual fallback calculation used due to AI service unavailability."
			}
		};
	}
}

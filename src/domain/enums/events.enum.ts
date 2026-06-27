export enum AUTH_EVENTS {
	USER_SIGNUP = "auth.user.signup",
	RECRUITER_SIGNUP = "auth.recruiter.signup",
	OTP_GENERATED = "auth.otp.generated",
	FORGOT_PASSWORD = "auth.password.forgot",
}

export enum JOB_EVENTS {
	JOB_CREATED = "job.created",
	JOB_APPLIED = "job.applied",
	APPLICATION_STATUS_UPDATED = "job.application.status_updated",
}

export enum ADMIN_EVENTS {
	USER_BLOCKED_UNBLOCKED = "admin.user.blocked_unblocked",
	RECRUITER_BLOCKED_UNBLOCKED = "admin.recruiter.blocked_unblocked",
	JOB_BLOCKED_UNBLOCKED = "admin.job.blocked_unblocked",
}

export enum INTERVIEWER_ROUTERS {
	RECRUITER_INTERVIEWERS = "recruiter/interviewers",
	RECRUITER_TEMPLATES = "recruiter/templates",
	RECRUITER_ROUNDS = "recruiter/interview-rounds",
	INTERVIEWER_ROUNDS = "interviewer/rounds",
	CANDIDATE_ROUNDS = "candidate/interview-rounds",
	ROOM_ROUNDS = "room/interview-rounds",
	
	DEFAULT = "",
	ID = ":id",
	APPROVE_RESCHEDULE = ":id/approve-reschedule",
	APPLICATION_ROUNDS = "application/:applicationId",
	FEEDBACK = ":roundId/feedback",
	CONFIRM = ":roundId/confirm",
	RESCHEDULE = ":roundId/reschedule",
	JOIN_ROOM = ":meetingCode/join",
	MEETING_CODE = ":meetingCode",
	
	AUTH_INTERVIEWER_LOGIN = "auth/interviewer/login",
	AUTH_INTERVIEWER_LOGOUT = "auth/interviewer/logout",
	AUTH_INTERVIEWER_REFRESH = "auth/interviewer/refresh",
	INTERVIEWER_PROFILE = "interviewer/profile",
}

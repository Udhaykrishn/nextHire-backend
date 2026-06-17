import { z } from "zod";

export const envSchema = z.object({
	PORT: z.string().min(1),

	MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

	REDIS_URL: z.string().min(1, "REDIS_URL is required"),

	GMAIL_APP_PASSWORD: z.string().min(1, "GMAIL_APP_PASSWORD is required"),
	GMAIL_APP_ADDRESS: z.string().min(1, "GMAIL_APP_ADDRESS is required"),

	GEMINI_API: z.string().min(1, "GEMINI_API is required"),
	GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
	GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required").optional(),
	FRONTEND_API: z.string().min(1, "FRONTEND_API is required"),

	JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
	GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),

	AWS_ACCESS_KEY: z.string().min(1),
	AWS_SECRET_KEY: z.string().min(1),
	AWS_REGION: z.string().min(1),
	S3_BUCKET_NAME: z.string().min(1),

	RESET_TOKEN_EXPIRATION: z.coerce.number().default(300),
	ACCESS_TOKEN_EXPIRATION: z.coerce.number().default(3600000), // 1 hour
	REFRESH_TOKEN_EXPIRATION: z.coerce.number().default(604800000), // 7 days

	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

	STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
	STRIPE_WEBHOOK_SECRET: z.string().optional(),
	STRIPE_CURRENCY: z.string().optional(),
	STRIPE_FRONTEND_URL: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules";
import { ConfigService } from "@nestjs/config";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { helmetConfigOptions } from "@/presentation/config";
import { ValidationPipe } from "@nestjs/common";
import { GlobalExceptionFilter } from "./presentation/filter/global-exception.filter";
import { otelSDK } from "./otel";
import { ResponseInterceptor } from "./presentation/interceptors/response.intercepotor";

import { json, urlencoded } from "express";

import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import { xssMiddleware } from "./presentation/middleware/xss.middleware";

async function bootstrap() {
	otelSDK.start();
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn", "debug"],
		autoFlushLogs: true,
		bodyParser: false,
	});

	const server = app.getHttpAdapter().getInstance();
	server.set("trust proxy", 1);

	app.use(
		json({
			limit: "100kb",
			verify: (req: Record<string, unknown>, _res, buf) => {
				req.rawBody = buf;
			},
		}),
	);
	app.use(urlencoded({ extended: true, limit: "100kb" }));

	app.use((req, _res, next) => {
		Object.defineProperty(req, "query", {
			value: { ...req.query },
			writable: true,
			configurable: true,
			enumerable: true,
		});
		next();
	});

	app.enableCors({
		origin: process.env.FRONTEND_API,
		credentials: true,
		exposedHeaders: ["X-XSRF-TOKEN", "X-Request-Id"],
	});

	app.use(helmet(helmetConfigOptions));
	app.use(cookieParser());
	app.use(compression());
	app.use(mongoSanitize());
	// hpp collapses repeat query params to their last value to block parameter
	// pollution. Whitelist the multi-select job filters so selecting more than one
	// option in a group (e.g. Entry + Mid) keeps the full array instead of just the last.
	app.use(
		hpp({
			whitelist: ["experience", "salary", "jobTypes", "locationTypes", "jobCategories"],
		}),
	);
	app.use(xssMiddleware);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);

	app.useGlobalFilters(new GlobalExceptionFilter());
	app.useGlobalInterceptors(new ResponseInterceptor());
	app.setGlobalPrefix("api/v1");

	const configService = app.get(ConfigService);
	const port = configService.get("PORT");
	await app.listen(port);

	const shutdown = async () => {
		console.log("Shutting down...");
		await app.close();
		await otelSDK.shutdown();
		process.exit(0);
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
}

bootstrap();

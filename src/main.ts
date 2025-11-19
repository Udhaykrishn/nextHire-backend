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

async function bootstrap() {
  otelSDK.start()
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn", "log", "debug"],
		bufferLogs: true,
	});

	app.enableCors({
		origin: process.env.FRONTEND_API,
		credentials: true,
	});
	app.use(helmet(helmetConfigOptions));
	app.use(cookieParser());
	app.use(compression());

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
	app.setGlobalPrefix("api/v1");

	const configService = app.get(ConfigService);
	const port = configService.get("PORT");
	await app.listen(port);

	const shutdown = async () => {
		console.log("Shutting down...");
		await app.close();
    await otelSDK.shutdown()
		process.exit(0);
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
}

bootstrap();

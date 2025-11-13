import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules";
import { ConfigService } from "@nestjs/config";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { helmetConfigOptions } from "@/presentation/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn"],
	});

	app.enableCors();
	app.use(helmet(helmetConfigOptions));

	app.use(cookieParser());

	app.use(compression());

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
			skipMissingProperties: true,
		}),
	);

	const configService = app.get(ConfigService);
	const port = configService.get("PORT");

	await app.listen(port);

	const shutdown = async () => {
		console.log("Shutting down...");
		await app.close();
		process.exit(0);
	};

	process.on("SIGINT", shutdown);
	process.on("SIGTERM", shutdown);
}
bootstrap();

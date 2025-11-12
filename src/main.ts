import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules";
import { ConfigService } from "@nestjs/config";
import compression from "compression";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { helmetConfigOptions } from "@/presentation/config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		logger: ["error", "warn"],
	});

	app.enableCors();
	app.use(helmet(helmetConfigOptions));

	app.use(cookieParser());

	app.use(compression());

	const configService = app.get(ConfigService);
	const port = configService.get("PORT");

	await app.listen(port);
	console.log("Nest application successfully started");
}
bootstrap();

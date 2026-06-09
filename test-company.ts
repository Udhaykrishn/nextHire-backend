import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/modules/app.module";
import { COMPANY_TOKEN } from "./src/application/enums/tokens";

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(AppModule);
	const useCase = app.get(COMPANY_TOKEN.GET_COMPANIES_USE_CASE);
	try {
		const res = await useCase.execute("invalid-id");
		console.log("Success:", res);
	} catch (e) {
		console.error("Error from useCase:", e);
	}
	await app.close();
}
bootstrap();

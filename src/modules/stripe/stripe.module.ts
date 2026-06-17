import { Module } from "@nestjs/common";
import { StripeModule as GoLevelUpStripeModule } from "@golevelup/nestjs-stripe";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { StripeService } from "@/infrastructure/services/stripe/stripe.service";
import { StripeController } from "@/presentation/controller/stripe/stripe.controller";

@Module({
	imports: [
		ConfigModule,
		GoLevelUpStripeModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				apiKey: configService.get<string>("STRIPE_SECRET_KEY") || "",
				webhookConfig: {
					stripeSecrets: {
						account: configService.get<string>("STRIPE_WEBHOOK_SECRET") || "",
					},
				},
			}),
		}),
	],
	controllers: [StripeController],
	providers: [StripeService],
	exports: [StripeService],
})
export class StripeModule {}

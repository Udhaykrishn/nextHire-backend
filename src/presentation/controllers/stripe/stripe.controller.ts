import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import type { Response } from "express";
import { StripeService } from "@/infrastructure/services/stripe/stripe.service";
import { STRIPE_ROUTERS, STRIPE_MESSAGES } from "@/presentation/enums";

@Controller(STRIPE_ROUTERS.ROUTER)
export class StripeController {
	constructor(private readonly stripeService: StripeService) {}

	@Post(STRIPE_ROUTERS.CREATE_CHECKOUT_SESSION)
	async createCheckoutSession(
		@Body() body: { priceId: string; userId: string; email: string; role?: string },
		@Res() res: Response,
	) {
		try {
			const { priceId, userId, email, role } = body;
			const session = await this.stripeService.createCheckoutSession(priceId, userId, email, role);
			return res.status(HttpStatus.OK).json({ url: session.url });
		} catch (error) {
			console.error(STRIPE_MESSAGES.ERROR_CREATING_SESSION, error);
			return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
		}
	}
}

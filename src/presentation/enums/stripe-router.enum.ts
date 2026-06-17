export enum STRIPE_ROUTERS {
	ROUTER = "stripe",
	CREATE_CHECKOUT_SESSION = "create-checkout-session",
}

export enum STRIPE_WEBHOOK_EVENTS {
	CHECKOUT_SESSION_COMPLETED = "checkout.session.completed",
	CUSTOMER_SUBSCRIPTION_UPDATED = "customer.subscription.updated",
	CUSTOMER_SUBSCRIPTION_DELETED = "customer.subscription.deleted",
}

export enum STRIPE_REDIRECT_PATHS {
	DASHBOARD = "/dashboard",
	JOBS = "/jobs",
}

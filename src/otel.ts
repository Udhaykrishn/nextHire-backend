import { NodeSDK } from "@opentelemetry/sdk-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

const prometheusExporter = new PrometheusExporter(
	{
		port: 9464,
		endpoint: "/metrics",
	},
	() => {
		console.log("✔ Prometheus metrics ready at http://localhost:9464/metrics");
	},
);

const resource = resourceFromAttributes({
	[ATTR_SERVICE_NAME]: "nexthire-backend",
	[ATTR_SERVICE_VERSION]: "1.0.0",
	"deployment.environment": process.env.NODE_ENV ?? "development",
});

export const otelSDK = new NodeSDK({
	resource,
	metricReader: prometheusExporter,

	instrumentations: [
		getNodeAutoInstrumentations({
			"@opentelemetry/instrumentation-http": {
				enabled: true,
			},
			"@opentelemetry/instrumentation-express": {
				enabled: true,
			},
			"@opentelemetry/instrumentation-mongoose": {
				enabled: true,
			},
			// Disable noisy fs instrumentation
			"@opentelemetry/instrumentation-fs": {
				enabled: false,
			},
		}),
	],
});

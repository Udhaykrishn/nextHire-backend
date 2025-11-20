import { NodeSDK } from "@opentelemetry/sdk-node";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";

const prometheusExporter = new PrometheusExporter(
	{
		port: 9464,
		endpoint: "/metrics",
	},
	() => {
		console.log("✔ Prometheus metrics ready at http://localhost:9464/metrics");
	},
);

export const otelSDK = new NodeSDK({
	metricReader: prometheusExporter,

	instrumentations: [
		getNodeAutoInstrumentations({
			"@opentelemetry/instrumentation-http": {
				enabled: true,
			},
			"@opentelemetry/instrumentation-express": {
				enabled: true,
			},
		}),
	],
});

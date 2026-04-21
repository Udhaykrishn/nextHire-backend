import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { Counter, Histogram, Gauge, ValueType } from "@opentelemetry/api";
import { metrics } from "@opentelemetry/api";

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
	private meter = metrics.getMeter("nexthire-backend");

	// ─── HTTP Metrics ───────────────────────────────────────────
	public httpRequestDuration!: Histogram;
	public httpRequestTotal!: Counter;
	public httpActiveRequests!: Gauge;

	// ─── System Metrics ─────────────────────────────────────────
	public memoryUsageRss!: Gauge;
	public memoryUsageHeapTotal!: Gauge;
	public memoryUsageHeapUsed!: Gauge;
	public memoryUsageExternal!: Gauge;
	public cpuUsageUser!: Gauge;
	public cpuUsageSystem!: Gauge;
	public eventLoopLag!: Gauge;

	// ─── Application Metrics ────────────────────────────────────
	public activeUsers!: Gauge;
	public dbQueryDuration!: Histogram;
	public dbQueryTotal!: Counter;
	public queueJobDuration!: Histogram;
	public queueJobTotal!: Counter;
	public queueJobFailures!: Counter;
	public authLoginTotal!: Counter;
	public authLoginFailures!: Counter;

	private systemMetricsInterval: ReturnType<typeof setInterval> | null = null;

	onModuleInit() {
		this.initHttpMetrics();
		this.initSystemMetrics();
		this.initApplicationMetrics();
		this.startSystemMetricsCollection();
	}

	onModuleDestroy() {
		if (this.systemMetricsInterval) {
			clearInterval(this.systemMetricsInterval);
		}
	}

	// ────────────────────────────────────────────────────────────
	//  HTTP Metrics
	// ────────────────────────────────────────────────────────────
	private initHttpMetrics() {
		this.httpRequestDuration = this.meter.createHistogram("http_request_duration_seconds", {
			description: "Duration of HTTP requests in seconds",
			unit: "s",
			valueType: ValueType.DOUBLE,
		});

		this.httpRequestTotal = this.meter.createCounter("http_requests_total", {
			description: "Total number of HTTP requests",
			valueType: ValueType.INT,
		});

		this.httpActiveRequests = this.meter.createGauge("http_active_requests", {
			description: "Number of currently active HTTP requests",
			valueType: ValueType.INT,
		});
	}

	// ────────────────────────────────────────────────────────────
	//  System Metrics (Memory, CPU, Event Loop)
	// ────────────────────────────────────────────────────────────
	private initSystemMetrics() {
		this.memoryUsageRss = this.meter.createGauge("process_memory_rss_bytes", {
			description: "Resident Set Size memory in bytes",
			unit: "bytes",
			valueType: ValueType.INT,
		});

		this.memoryUsageHeapTotal = this.meter.createGauge("process_memory_heap_total_bytes", {
			description: "Total heap memory in bytes",
			unit: "bytes",
			valueType: ValueType.INT,
		});

		this.memoryUsageHeapUsed = this.meter.createGauge("process_memory_heap_used_bytes", {
			description: "Used heap memory in bytes",
			unit: "bytes",
			valueType: ValueType.INT,
		});

		this.memoryUsageExternal = this.meter.createGauge("process_memory_external_bytes", {
			description: "External memory in bytes (C++ objects bound to JS)",
			unit: "bytes",
			valueType: ValueType.INT,
		});

		this.cpuUsageUser = this.meter.createGauge("process_cpu_user_seconds_total", {
			description: "Total user CPU time spent in seconds",
			unit: "s",
			valueType: ValueType.DOUBLE,
		});

		this.cpuUsageSystem = this.meter.createGauge("process_cpu_system_seconds_total", {
			description: "Total system CPU time spent in seconds",
			unit: "s",
			valueType: ValueType.DOUBLE,
		});

		this.eventLoopLag = this.meter.createGauge("nodejs_eventloop_lag_seconds", {
			description: "Event loop lag in seconds",
			unit: "s",
			valueType: ValueType.DOUBLE,
		});
	}

	// ────────────────────────────────────────────────────────────
	//  Application-specific Metrics
	// ────────────────────────────────────────────────────────────
	private initApplicationMetrics() {
		this.activeUsers = this.meter.createGauge("app_active_users", {
			description: "Number of currently active/connected users",
			valueType: ValueType.INT,
		});

		this.dbQueryDuration = this.meter.createHistogram("db_query_duration_seconds", {
			description: "Duration of database queries in seconds",
			unit: "s",
			valueType: ValueType.DOUBLE,
		});

		this.dbQueryTotal = this.meter.createCounter("db_queries_total", {
			description: "Total number of database queries",
			valueType: ValueType.INT,
		});

		this.queueJobDuration = this.meter.createHistogram("queue_job_duration_seconds", {
			description: "Duration of queue job processing in seconds",
			unit: "s",
			valueType: ValueType.DOUBLE,
		});

		this.queueJobTotal = this.meter.createCounter("queue_jobs_total", {
			description: "Total number of queue jobs processed",
			valueType: ValueType.INT,
		});

		this.queueJobFailures = this.meter.createCounter("queue_jobs_failed_total", {
			description: "Total number of failed queue jobs",
			valueType: ValueType.INT,
		});

		this.authLoginTotal = this.meter.createCounter("auth_login_total", {
			description: "Total login attempts",
			valueType: ValueType.INT,
		});

		this.authLoginFailures = this.meter.createCounter("auth_login_failures_total", {
			description: "Total failed login attempts",
			valueType: ValueType.INT,
		});
	}

	// ────────────────────────────────────────────────────────────
	//  Periodic system metrics collection (every 5s)
	// ────────────────────────────────────────────────────────────
	private startSystemMetricsCollection() {
		const collectSystemMetrics = () => {
			// Memory
			const memUsage = process.memoryUsage();
			this.memoryUsageRss.record(memUsage.rss);
			this.memoryUsageHeapTotal.record(memUsage.heapTotal);
			this.memoryUsageHeapUsed.record(memUsage.heapUsed);
			this.memoryUsageExternal.record(memUsage.external);

			// CPU
			const cpuUsage = process.cpuUsage();
			this.cpuUsageUser.record(cpuUsage.user / 1e6); // microseconds → seconds
			this.cpuUsageSystem.record(cpuUsage.system / 1e6);
		};

		// Collect immediately, then every 5 seconds
		collectSystemMetrics();
		this.systemMetricsInterval = setInterval(collectSystemMetrics, 5000);

		// Event loop lag measurement
		this.measureEventLoopLag();
	}

	private measureEventLoopLag() {
		const measureLag = () => {
			const start = process.hrtime.bigint();
			setImmediate(() => {
				const lag = Number(process.hrtime.bigint() - start) / 1e9; // ns → seconds
				this.eventLoopLag.record(lag);
			});
		};

		setInterval(measureLag, 5000);
	}

	// ────────────────────────────────────────────────────────────
	//  Helper: record HTTP request metrics
	// ────────────────────────────────────────────────────────────
	recordHttpRequest(method: string, route: string, statusCode: number, durationMs: number) {
		const labels = {
			method,
			route,
			status_code: String(statusCode),
		};

		this.httpRequestDuration.record(durationMs / 1000, labels);
		this.httpRequestTotal.add(1, labels);
	}

	// ────────────────────────────────────────────────────────────
	//  Helper: record DB query metrics
	// ────────────────────────────────────────────────────────────
	recordDbQuery(operation: string, collection: string, durationMs: number) {
		const labels = { operation, collection };
		this.dbQueryDuration.record(durationMs / 1000, labels);
		this.dbQueryTotal.add(1, labels);
	}

	// ────────────────────────────────────────────────────────────
	//  Helper: record queue job metrics
	// ────────────────────────────────────────────────────────────
	recordQueueJob(jobName: string, status: "completed" | "failed", durationMs: number) {
		const labels = { job_name: jobName, status };
		this.queueJobDuration.record(durationMs / 1000, labels);
		this.queueJobTotal.add(1, labels);
		if (status === "failed") {
			this.queueJobFailures.add(1, { job_name: jobName });
		}
	}
}

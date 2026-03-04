import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
    @Get()
    check() {
        const memUsage = process.memoryUsage();
        const uptime = process.uptime();
        const cpuUsage = process.cpuUsage();

        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            uptime: {
                seconds: Math.floor(uptime),
                formatted: this.formatUptime(uptime),
            },
            memory: {
                rss: this.formatBytes(memUsage.rss),
                heapTotal: this.formatBytes(memUsage.heapTotal),
                heapUsed: this.formatBytes(memUsage.heapUsed),
                external: this.formatBytes(memUsage.external),
                heapUtilization: `${((memUsage.heapUsed / memUsage.heapTotal) * 100).toFixed(1)}%`,
            },
            cpu: {
                userMicroseconds: cpuUsage.user,
                systemMicroseconds: cpuUsage.system,
            },
            nodeVersion: process.version,
            pid: process.pid,
        };
    }

    private formatBytes(bytes: number): string {
        const units = ["B", "KB", "MB", "GB"];
        let unitIndex = 0;
        let size = bytes;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    private formatUptime(seconds: number): string {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${mins}m ${secs}s`;
    }
}

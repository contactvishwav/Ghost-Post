import { Request, Response } from 'express';
import { clickhouseService } from '../services/clickhouse.service';
import { prisma } from '../db';
import config from '../config';
import logger from '../utils/logger';

async function getPostgresMetrics() {
    const [aggResult, modelRows, recentLogs, volumeRows] = await Promise.all([
        prisma.agentLog.aggregate({
            _count: { id: true },
            _avg: { latencyMs: true },
            _sum: { tokenUsage: true, cost: true },
        }),
        prisma.agentLog.groupBy({
            by: ['modelUsed'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
        }),
        prisma.agentLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: {
                id: true,
                modelUsed: true,
                tokenUsage: true,
                cost: true,
                createdAt: true,
                requestId: true,
            },
        }),
        // Group by hour for the last 24 hours using raw query
        prisma.$queryRaw`
            SELECT
                date_trunc('hour', "createdAt") AS hour,
                COUNT(*)::int AS count
            FROM "AgentLog"
            WHERE "createdAt" > NOW() - INTERVAL '24 hours'
            GROUP BY 1
            ORDER BY 1 ASC
        `,
    ]);

    const total = aggResult._count.id as number;
    const totalModels = modelRows.reduce((sum: number, r: any) => sum + r._count.id, 0);

    const kpis = {
        total_requests: total,
        avg_latency: total > 0 ? Math.round((aggResult._avg.latencyMs ?? 0) / 10) / 100 : 0,
        total_tokens: aggResult._sum.tokenUsage ?? 0,
        total_cost: aggResult._sum.cost ?? 0,
        success_rate: 100,
    };

    const models = modelRows.map((r: any) => ({
        model: r.modelUsed,
        count: r._count.id,
        percentage: totalModels > 0 ? Math.round((r._count.id / totalModels) * 1000) / 10 : 0,
    }));

    const logs = recentLogs.map((r: any) => ({
        id: r.requestId,
        model: r.modelUsed,
        tokens: r.tokenUsage ?? 0,
        cost: r.cost ?? 0,
        status: 200,
        time: r.createdAt,
    }));

    return { kpis, models, logs, volume: volumeRows };
}

export const adminController = {
    async getDashboardMetrics(_req: Request, res: Response) {
        try {
            // Use ClickHouse only when Helicone is explicitly enabled
            if (config.helicone.enabled) {
                const [kpis, volume, models, logs] = await Promise.all([
                    clickhouseService.getKpis(),
                    clickhouseService.getVolumeData(),
                    clickhouseService.getModelDistribution(),
                    clickhouseService.getRecentLogs(10),
                ]);

                // If ClickHouse returned real data, use it
                if (kpis.total_requests > 0) {
                    return res.status(200).json({ kpis, volume, models, logs });
                }
            }

            // Fall back to Postgres AgentLog table
            try {
                const pgMetrics = await getPostgresMetrics();
                return res.status(200).json(pgMetrics);
            } catch (pgError: any) {
                logger.warn({ error: pgError.message }, 'Postgres AgentLog fallback failed — returning empty metrics');
            }

            // Final fallback: return empty dashboard rather than a 500
            return res.status(200).json({
                kpis: { total_requests: 0, avg_latency: 0, total_tokens: 0, total_cost: 0, success_rate: 100 },
                volume: [],
                models: [],
                logs: [],
            });
        } catch (error: any) {
            logger.error({ error: error.message }, 'Failed to fetch dashboard metrics');
            res.status(500).json({ error: 'Failed to fetch metrics' });
        }
    }
};

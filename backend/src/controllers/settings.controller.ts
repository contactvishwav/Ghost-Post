import { Request, Response } from 'express';
import { prisma } from '../db';
import { asyncHandler } from '../utils/asyncHandler';

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
    let settings = await prisma.settings.findUnique({
        where: { id: 'global' }
    });
    
    if (!settings) {
        settings = await prisma.settings.create({
            data: { id: 'global', themeHue: 250, userName: 'Ghost Writer' }
        });
    }
    
    res.json(settings);
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
    const settings = await prisma.settings.upsert({
        where: { id: 'global' },
        update: req.body,
        create: { ...req.body, id: 'global' }
    });
    res.json(settings);
});

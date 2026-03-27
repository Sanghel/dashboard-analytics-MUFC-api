import { Request, Response, NextFunction } from 'express';
import { getStats, getInfo } from '../services/team.service';

interface AppError extends Error {
  status?: number;
}

export const info = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { season, leagueId } = req.query;
    const data = await getInfo({
      season: season ? parseInt(season as string, 10) : undefined,
      leagueId: leagueId ? parseInt(leagueId as string, 10) : undefined,
    });
    if (!data) {
      const err: AppError = new Error('Team info not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const stats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { season, leagueId } = req.query;
    const data = await getStats({
      season: season ? parseInt(season as string, 10) : undefined,
      leagueId: leagueId ? parseInt(leagueId as string, 10) : undefined,
    });
    if (!data) {
      const err: AppError = new Error('Team stats not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

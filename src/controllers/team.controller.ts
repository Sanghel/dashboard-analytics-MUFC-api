import { Request, Response, NextFunction } from 'express';
import { getStats } from '../services/team.service';

interface AppError extends Error {
  status?: number;
}

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

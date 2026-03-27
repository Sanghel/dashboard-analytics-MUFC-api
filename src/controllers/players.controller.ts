import { Request, Response, NextFunction } from 'express';
import { getPlayers, getPlayer } from '../services/players.service';

interface AppError extends Error {
  status?: number;
}

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { season } = req.query;
    const data = await getPlayers({ season: season ? parseInt(season as string, 10) : undefined });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

export const detail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { season } = req.query;
    const data = await getPlayer(id, {
      season: season ? parseInt(season as string, 10) : undefined,
    });
    if (!data) {
      const err: AppError = new Error('Player not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

import { Request, Response, NextFunction } from 'express';
import {
  getFixtures,
  getRecent,
  getUpcoming,
  getFixtureDetail,
} from '../services/fixtures.service';

interface AppError extends Error {
  status?: number;
}

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { season } = req.query;
    const data = await getFixtures({ season: season ? parseInt(season as string, 10) : undefined });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

export const recent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit, season } = req.query;
    const data = await getRecent({
      limit: limit ? parseInt(limit as string, 10) : undefined,
      season: season ? parseInt(season as string, 10) : undefined,
    });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

export const upcoming = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { limit, season } = req.query;
    const data = await getUpcoming({
      limit: limit ? parseInt(limit as string, 10) : undefined,
      season: season ? parseInt(season as string, 10) : undefined,
    });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

export const detail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = await getFixtureDetail(id);
    if (!data) {
      const err: AppError = new Error('Fixture not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

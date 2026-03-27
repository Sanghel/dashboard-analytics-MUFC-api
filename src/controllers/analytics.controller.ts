import { Request, Response, NextFunction } from 'express';
import { getOverview } from '../services/analytics.service';

export const overview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await getOverview();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

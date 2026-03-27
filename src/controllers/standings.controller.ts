import { Request, Response, NextFunction } from 'express';
import { getLeagueStandings } from '../services/standings.service';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { season, leagueId } = req.query;
    const data = await getLeagueStandings({
      season: season ? parseInt(season as string, 10) : undefined,
      leagueId: leagueId ? parseInt(leagueId as string, 10) : undefined,
    });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

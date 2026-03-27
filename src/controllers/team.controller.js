const { getStats } = require('../services/team.service');

const stats = async (req, res, next) => {
  try {
    const { season, leagueId } = req.query;
    const data = await getStats({
      season: season ? parseInt(season, 10) : undefined,
      leagueId: leagueId ? parseInt(leagueId, 10) : undefined,
    });
    if (!data) {
      const err = new Error('Team stats not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { stats };

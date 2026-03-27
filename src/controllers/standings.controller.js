const { getLeagueStandings } = require('../services/standings.service');

const list = async (req, res, next) => {
  try {
    const { season, leagueId } = req.query;
    const data = await getLeagueStandings({
      season: season ? parseInt(season, 10) : undefined,
      leagueId: leagueId ? parseInt(leagueId, 10) : undefined,
    });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

module.exports = { list };

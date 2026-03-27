const { getPlayers, getPlayer } = require('../services/players.service');

const list = async (req, res, next) => {
  try {
    const { season } = req.query;
    const data = await getPlayers({ season: season ? parseInt(season, 10) : undefined });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { season } = req.query;
    const data = await getPlayer(id, {
      season: season ? parseInt(season, 10) : undefined,
    });
    if (!data) {
      const err = new Error('Player not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, detail };

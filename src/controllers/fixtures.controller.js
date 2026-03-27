const {
  getFixtures,
  getRecent,
  getUpcoming,
  getFixtureDetail,
} = require('../services/fixtures.service');

const list = async (req, res, next) => {
  try {
    const { season } = req.query;
    const data = await getFixtures({ season: season ? parseInt(season, 10) : undefined });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

const recent = async (req, res, next) => {
  try {
    const { limit, season } = req.query;
    const data = await getRecent({
      limit: limit ? parseInt(limit, 10) : undefined,
      season: season ? parseInt(season, 10) : undefined,
    });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

const upcoming = async (req, res, next) => {
  try {
    const { limit, season } = req.query;
    const data = await getUpcoming({
      limit: limit ? parseInt(limit, 10) : undefined,
      season: season ? parseInt(season, 10) : undefined,
    });
    res.json({ success: true, data, meta: { total: data.length } });
  } catch (err) {
    next(err);
  }
};

const detail = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await getFixtureDetail(id);
    if (!data) {
      const err = new Error('Fixture not found');
      err.status = 404;
      return next(err);
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, recent, upcoming, detail };

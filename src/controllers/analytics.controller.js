const { getOverview } = require('../services/analytics.service');

const overview = async (req, res, next) => {
  try {
    const data = await getOverview();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { overview };

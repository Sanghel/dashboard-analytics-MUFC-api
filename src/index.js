require('dotenv').config();
const { validateEnv } = require('./config/env');
const { testConnection } = require('./config/db');
const { registerJobs } = require('./jobs/index');
const app = require('./app');

validateEnv();

const PORT = process.env.PORT || 3000;

const start = async () => {
  await testConnection();
  registerJobs();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

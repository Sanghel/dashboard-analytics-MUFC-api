import 'dotenv/config';
import { validateEnv } from './config/env';
import { testConnection } from './config/db';
import { registerJobs } from './jobs/index';
import app from './app';

validateEnv();

const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  await testConnection();
  registerJobs();
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', (err as Error).message);
  process.exit(1);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { validateEnv } = require('./config/env');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', routes);
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

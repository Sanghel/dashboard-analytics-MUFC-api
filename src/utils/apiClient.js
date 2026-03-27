const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
  headers: {
    'x-apisports-key': process.env.API_KEY,
  },
  timeout: 10000,
});

module.exports = apiClient;

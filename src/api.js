// api.js

import axios from "axios";
const { CancelToken, cancel } = axios.CancelToken.source();
// Set a base URL for your API, if applicable
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

// Define your Axios instance with custom configuration, if needed
const instance = axios.create({
  // Custom configuration options here
});

export { instance, cancel };

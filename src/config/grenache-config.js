// grenache-config.js
// This file contains configuration settings for the Grenache DHT connection.
// These settings are used by the client nodes to connect to the distributed network.

module.exports = {
  grapeAddress: "http://127.0.0.1:30001", // Default Grape node address

  rpcClientOptions: {
    timeout: 10000, // RPC client timeout in milliseconds
  },

  network: {
    announceInterval: 1000, // Interval (in ms) for announcing services to the DHT
    grapeConnectionRetries: 5, // Number of retry attempts if the Grape connection fails
    retryDelay: 2000, // Delay (in ms) between retry attempts
  },
};

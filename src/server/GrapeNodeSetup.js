// GrapeNodeSetup.js
// This file is responsible for programmatically setting up and managing Grape (DHT) nodes for the P2P network.

const { Grape } = require("grenache-grape");
const Logger = require("../utils/Logger");

class GrapeNodeSetup {
  /**
   * Creates a new GrapeNodeSetup instance and initializes the Grape node.
   * @param {number} dhtPort - The port used for DHT communication.
   * @param {number} apiPort - The port used for client RPC communication.
   * @param {string} bootstrapNode - The address of the bootstrap node for connecting to the DHT network.
   */
  constructor(dhtPort, apiPort, bootstrapNode) {
    this.dhtPort = dhtPort;
    this.apiPort = apiPort;
    this.bootstrapNode = bootstrapNode;

    // Create a new Grape instance with the provided configuration
    this.grape = new Grape({
      dht_port: this.dhtPort, // Port used for DHT communication
      dht_bootstrap: [this.bootstrapNode], // Bootstrap node to connect with the DHT network
      api_port: this.apiPort, // Port for client API communication
    });
  }

  /**
   * Starts the Grape node and handles the lifecycle events.
   * Logs the status of the Grape node for easier monitoring.
   */
  startNode() {
    Logger.info(
      `Starting Grape node with DHT port: ${this.dhtPort} and API port: ${this.apiPort}...`
    );

    // Start the Grape node
    this.grape.start();

    // Handle the 'ready' event when the Grape node is fully operational
    this.grape.on("ready", () => {
      Logger.info(
        `Grape node is ready. DHT port: ${this.dhtPort}, API port: ${this.apiPort}`
      );
    });

    // Handle errors in the Grape node
    this.grape.on("error", (err) => {
      Logger.error(`Grape node encountered an error: ${err.message}`);
    });

    // Handle the 'node' event to log when the node connects to another peer
    this.grape.on("node", (peer) => {
      Logger.info(`Connected to peer: ${peer}`);
    });
  }

  /**
   * Stops the Grape node and logs the shutdown event.
   */
  stopNode() {
    Logger.info(
      `Stopping Grape node with DHT port: ${this.dhtPort} and API port: ${this.apiPort}...`
    );
    this.grape.stop((err) => {
      if (err) {
        Logger.error(`Error stopping Grape node: ${err.message}`);
      } else {
        Logger.info("Grape node stopped successfully.");
      }
    });
  }
}

module.exports = GrapeNodeSetup;

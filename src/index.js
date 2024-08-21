// index.js
// The main entry point for the P2P distributed exchange client node.
// This file initializes the client node, sets up the Grape network connection, and starts listening for orders.

const Link = require("grenache-nodejs-link");
const { PeerRPCClient } = require("grenache-nodejs-http");
const ClientNode = require("./client/ClientNode");
const config = require("./config/grenache-config");
const Logger = require("./utils/Logger");

// Initialize the Grenache Link for connecting to the Grape network
const link = new Link({
  grape: config.grapeAddress, // Use the Grape address defined in the configuration
});

link.start();

// Initialize the PeerRPCClient for RPC communication
const peer = new PeerRPCClient(link, config.rpcClientOptions);
peer.init();

// Create an instance of the ClientNode, passing in the PeerRPCClient
const clientNode = new ClientNode(peer);

// Example: Submitting an order for testing purposes
const testOrder = {
  type: "buy",
  price: 100,
  quantity: 10,
};

// Emit the event to submit an order (this simulates user interaction)
process.emit("submitOrder", testOrder);

// Gracefully handle application shutdown
process.on("SIGINT", () => {
  Logger.info("Shutting down client node...");
  link.stop();
  process.exit(0);
});

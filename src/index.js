// index.js
// The main entry point for the P2P distributed exchange client node.
// This file initializes the client node, sets up the Grape network connection, and starts listening for orders.

const ClientNode = require("./client/ClientNode");
const config = require("./config/grenache-config");
const Logger = require("./utils/Logger");

// Create an instance of the ClientNode, passing in the PeerRPCClient
new ClientNode();

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
  process.exit(0);
});

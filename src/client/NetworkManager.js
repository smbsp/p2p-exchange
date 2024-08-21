// NetworkManager.js
// This file handles all communication between the client nodes in the P2P exchange system using Grenache.

const Logger = require("../utils/Logger");
const { PeerRPCServer, PeerRPCClient } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");
const config = require("../config/grenache-config");

class NetworkManager {
  /**
   * Constructs a new NetworkManager object with both client and server capabilities.
   * @param {Object} config - Configuration object containing grape, port, and other necessary details.
   */
  constructor() {
    // Initialize the link with the provided grape address
    this.link = new Link({
      grape: config.grapeAddress,
    });
    this.link.start();

    // Set up the RPC server
    this.peerServer = new PeerRPCServer(this.link, {
      timeout: 300000, // Set a long timeout for demonstration purposes
    });
    this.peerServer.init();

    // Set up the RPC client using the same link
    this.peerClient = new PeerRPCClient(this.link, {
      timeout: 300000, // Matching timeout for symmetry
    });
    this.peerClient.init();

    // Create and start the server service on a specified port
    this.service = this.peerServer.transport("server");
    this.service.listen(1337, () => {
      console.log("Server listening on port 1337");
    });
  }

  /**
   * Starts the server to listen for incoming requests on the network.
   */
  startServer() {
    this.peerServer.listen(this.port);
    Logger.info(`Server listening on port ${this.port}`);
  }

  /**
   * Sends an order to the network (to be received by other nodes).
   */
  sendOrder(order, callback) {
    const orderData = {
      type: order.type,
      price: order.price,
      quantity: order.quantity,
      timestamp: order.timestamp,
      orderId: order.orderId,
    };

    this.peerClient.request(
      "exchange_order",
      orderData,
      { timeout: 10000 },
      (err, response) => {
        if (err) {
          Logger.error(`Error sending order to the network: ${err.message}`);
          return callback(err);
        }

        Logger.info(`Order sent successfully: ${response}`);
        callback(null, response);
      }
    );
  }

  /**
   * Listens for incoming orders from other nodes in the network.
   */
  listenForOrders(callback) {
    // Repeatedly announce (every second) that this service is available under the name 'fibonacci_worker'
    // so that other nodes can find and use this worker for Fibonacci calculations.
    setInterval(() => {
      this.link.announce("exchange_order", this.service.port, {});
    }, 1000);

    this.service.on("request", (rid, key, payload, handler) => {
      if (key !== "exchange_order") return;

      Logger.info(
        `Received order from the network: ${JSON.stringify(payload)}`
      );
      const Order = require("./Order");
      const receivedOrder = new Order(payload);
      callback(null, receivedOrder);
      handler.reply(null, "Order received");
    });
  }
}

module.exports = NetworkManager;

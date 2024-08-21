// NetworkManager.js
// This file handles all communication between the client nodes in the P2P exchange system using Grenache.

const Logger = require("../utils/Logger");
const { PeerRPCClient, PeerRPCServer } = require("grenache-nodejs-http");
const Link = require("grenache-nodejs-link");

class NetworkManager {
  /**
   * Constructs a new NetworkManager object with both client and server capabilities.
   * @param {Object} config - Configuration object containing grape, port, and other necessary details.
   */
  constructor(config) {
    if (!config.grapeUrl) {
      Logger.error("Grape URL must be defined");
      throw new Error("Grape URL must be defined");
    }

    const link = new Link({
      grape: config.grapeUrl,
    });
    link.start();

    this.peerClient = new PeerRPCClient(link, {});
    this.peerClient.init();

    this.peerServer = new PeerRPCServer(link, {
      timeout: 300000,
    });
    this.peerServer.init();

    this.port = config.port;
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
    this.peerServer.on("request", (rid, key, payload, handler) => {
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

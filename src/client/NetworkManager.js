// NetworkManager.js
// This file handles all communication between the client nodes in the P2P exchange system using Grenache.

const Logger = require("../utils/Logger");
const { PeerRPCClient } = require("grenache-nodejs-http");

class NetworkManager {
  /**
   * Constructs a new NetworkManager object.
   * @param {PeerRPCClient} peerClient - An instance of Grenache's PeerRPCClient for sending and receiving messages.
   */
  constructor(peerClient) {
    this.peerClient = peerClient;
  }

  /**
   * Sends an order to the network (to be received by other nodes).
   * @param {Order} order - The order object to be sent.
   * @param {Function} callback - The callback function to handle the response or error.
   */
  sendOrder(order, callback) {
    Logger.info(`Sending order to the network: ${order.toString()}`);

    // Convert the order object to a plain JSON object for transmission
    const orderData = {
      type: order.type,
      price: order.price,
      quantity: order.quantity,
      timestamp: order.timestamp,
      orderId: order.orderId,
    };

    // Perform an RPC request to the network to propagate the order
    this.peerClient.request(
      "exchange_order",
      orderData,
      { timeout: 10000 },
      (err, response) => {
        if (err) {
          Logger.error(`Error sending order to the network: ${err.message}`);
          return callback(err, null);
        }

        Logger.info(`Order sent successfully: ${response}`);
        callback(null, response);
      }
    );
  }

  /**
   * Listens for incoming orders from other nodes in the network.
   * @param {Function} callback - The callback function to handle the received order.
   */
  listenForOrders(callback) {
    Logger.info("Listening for incoming orders from the network...");

    // Listen for incoming RPC requests (orders) from other nodes
    this.peerClient.listen("exchange_order", (err, orderData) => {
      if (err) {
        Logger.error(`Error receiving order from the network: ${err.message}`);
        return callback(err, null);
      }

      Logger.info(
        `Received order from the network: ${JSON.stringify(orderData)}`
      );

      // Convert the plain JSON object back into an Order instance
      const Order = require("./Order");
      const receivedOrder = new Order(orderData);

      // Invoke the callback with the received order
      callback(null, receivedOrder);
    });
  }
}

module.exports = NetworkManager;

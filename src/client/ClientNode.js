// Import necessary modules
const Grenache = require("grenache-nodejs-http"); // Grenache library for P2P communication
const Link = require("grenache-nodejs-link"); // Link is the interface to the Grape DHT
const OrderBook = require("./OrderBook"); // Order book module
const Order = require("./Order"); // Order class
const NetworkManager = require("./NetworkManager"); // Manages the communication between nodes
const Logger = require("../utils/Logger"); // Utility for logging

class ClientNode {
  constructor(grapeAddress) {
    // Initialize the DHT link
    this.link = new Link({
      grape: grapeAddress,
    });
    this.link.start();

    // Initialize Grenache peer (client node)
    this.peer = new Grenache.PeerRPCClient(this.link, {});
    this.peer.init();

    // Initialize the local order book
    this.orderBook = new OrderBook();

    // Initialize the network manager for handling communication
    this.networkManager = new NetworkManager(this.peer);

    // Bind event handlers
    this.setupEventHandlers();

    // Start listening for incoming orders from other nodes
    this.listenForIncomingOrders();
  }

  /**
   * Sets up event handlers for the client node.
   * You can add more event listeners here if needed for additional functionality.
   */
  setupEventHandlers() {
    // Example: Handling an order submission event (can be expanded for different events)
    process.on("submitOrder", (orderDetails) => {
      this.submitOrder(orderDetails);
    });
  }

  /**
   * Handles the submission of a new order.
   * @param {Object} orderDetails - Contains order properties like type, price, quantity.
   */
  submitOrder(orderDetails) {
    // Create a new order object
    const order = new Order(orderDetails);

    Logger.info(`Submitting new order: ${order.toString()}`);

    // Attempt to match the order locally
    const matchedOrders = this.orderBook.matchOrder(order);

    if (matchedOrders.length > 0) {
      Logger.info(`Order matched locally: ${matchedOrders}`);
    } else {
      // If no match is found, add the order to the local order book
      this.orderBook.addOrder(order);

      // Broadcast the order to other nodes in the network
      this.broadcastOrder(order);
    }
  }

  /**
   * Broadcasts an order to other nodes in the network.
   * @param {Order} order - The order to be propagated to other nodes.
   */
  broadcastOrder(order) {
    Logger.info(`Broadcasting order: ${order.toString()} to the network`);

    // Network manager handles sending the order to other nodes
    this.networkManager.sendOrder(order, (err, response) => {
      if (err) {
        Logger.error("Failed to broadcast order:", err);
      } else {
        Logger.info("Order broadcast successful:", response);
      }
    });
  }

  /**
   * Listens for incoming orders from other nodes in the network.
   */
  listenForIncomingOrders() {
    // Network manager listens for orders propagated by other nodes
    this.networkManager.listenForOrders((err, order) => {
      if (err) {
        Logger.error("Error receiving order:", err);
        return;
      }

      Logger.info(`Received order from another node: ${order.toString()}`);

      // Attempt to match the incoming order against the local order book
      const matchedOrders = this.orderBook.matchOrder(order);

      if (matchedOrders.length > 0) {
        Logger.info(`Incoming order matched locally: ${matchedOrders}`);
      } else {
        // If no match, add the order to the local order book
        this.orderBook.addOrder(order);
        Logger.info("Added incoming order to the local order book");
      }
    });
  }

  // Stop the link and peer to clean up resources
  stop() {
    if (this.link) {
      this.link.stop();
    }
    if (this.peer) {
      this.peer.stop(); // Make sure the PeerRPCClient or its base class has a stop method
    }
  }
}

module.exports = ClientNode;

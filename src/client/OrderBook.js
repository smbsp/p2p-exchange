// OrderBook.js
// This file handles the management of the order book, including adding orders and delegating the matching logic to OrderMatcher.js.

const OrderMatcher = require("./OrderMatcher");
const Logger = require("../utils/Logger");

class OrderBook {
  constructor() {
    // Two separate lists for buy and sell orders.
    // Buy orders are sorted by descending price (higher prices come first).
    // Sell orders are sorted by ascending price (lower prices come first).
    this.buyOrders = [];
    this.sellOrders = [];
  }

  /**
   * Adds a new order to the appropriate order book (buy or sell).
   * @param {Order} order - The order object to be added.
   */
  addOrder(order) {
    if (order.type === "buy") {
      this.buyOrders.push(order);
      // Sort the buy orders in descending order based on price.
      this.buyOrders.sort((a, b) => b.price - a.price);
    } else if (order.type === "sell") {
      this.sellOrders.push(order);
      // Sort the sell orders in ascending order based on price.
      this.sellOrders.sort((a, b) => a.price - b.price);
    }

    Logger.info(`Order added to the order book: ${order.toString()}`);
  }

  /**
   * Attempts to match an incoming order with existing orders in the order book.
   * Delegates the matching logic to OrderMatcher.js.
   * @param {Order} incomingOrder - The order to be matched.
   * @returns {Array<Object>} - The list of matched order details.
   */
  matchOrder(incomingOrder) {
    let matchedOrders = [];

    if (incomingOrder.type === "buy") {
      // Attempt to match the incoming buy order against the existing sell orders.
      const result = OrderMatcher.match(
        incomingOrder,
        this.sellOrders,
        (sellOrder, buyOrder) => sellOrder.price <= buyOrder.price
      );
      matchedOrders = result.matchedOrders;

      // If there's any remaining quantity in the incoming order, add it back to the buy order book.
      if (result.remainingQuantity > 0) {
        this.addOrder(incomingOrder);
      }
    } else if (incomingOrder.type === "sell") {
      // Attempt to match the incoming sell order against the existing buy orders.
      const result = OrderMatcher.match(
        incomingOrder,
        this.buyOrders,
        (buyOrder, sellOrder) => buyOrder.price >= sellOrder.price
      );
      matchedOrders = result.matchedOrders;

      // If there's any remaining quantity in the incoming order, add it back to the sell order book.
      if (result.remainingQuantity > 0) {
        this.addOrder(incomingOrder);
      }
    }

    return matchedOrders;
  }
}

module.exports = OrderBook;

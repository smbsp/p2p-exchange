// OrderMatcher.js
// This file contains the logic for matching incoming orders against existing orders in the order book.

const Logger = require("../utils/Logger");

class OrderMatcher {
  /**
   * Matches an incoming order against orders in the order book.
   * @param {Order} incomingOrder - The order that needs to be matched.
   * @param {Array<Order>} orderBook - The list of existing orders in the order book (either buy or sell).
   * @param {Function} matchCondition - A function that checks if two orders match based on price.
   * @returns {Object} - An object containing matched orders and any remaining quantity of the incoming order.
   */
  static match(incomingOrder, orderBook, matchCondition) {
    let matchedOrders = [];

    // Sort the orderBook to prioritize the best price for matching.
    if (incomingOrder.type === "buy") {
      // For a buy order, prioritize the lowest-priced sell orders.
      orderBook.sort((a, b) => a.price - b.price);
    } else if (incomingOrder.type === "sell") {
      // For a sell order, prioritize the highest-priced buy orders.
      orderBook.sort((a, b) => b.price - a.price);
    }

    while (incomingOrder.quantity > 0 && orderBook.length > 0) {
      const currentOrder = orderBook[0]; // Get the best (highest priority) order after sorting.

      // Check if the orders satisfy the matching condition (based on price).
      if (!matchCondition(currentOrder, incomingOrder)) {
        break; // If not matchable, exit the loop.
      }

      // Determine how much of the order can be matched.
      const matchQuantity = Math.min(
        incomingOrder.quantity,
        currentOrder.quantity
      );

      // Log the matching details.
      Logger.info(
        `Matching ${matchQuantity} units at price ${currentOrder.price} between ${incomingOrder.type} and ${currentOrder.type} orders.`
      );

      // Create a matched order object (new instance).
      matchedOrders.push({
        price: currentOrder.price,
        quantity: matchQuantity,
        timestamp: Date.now(),
      });

      // Adjust the quantities of the matched orders.
      incomingOrder.quantity -= matchQuantity;
      currentOrder.quantity -= matchQuantity;

      // If the current order is fully matched, remove it from the order book.
      if (currentOrder.quantity === 0) {
        orderBook.shift(); // Remove the order from the front of the queue.
      }
    }

    return {
      matchedOrders,
      remainingQuantity: incomingOrder.quantity,
    };
  }
}

module.exports = OrderMatcher;

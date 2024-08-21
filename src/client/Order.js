// Order.js
// This file defines the Order class, which represents an order (buy or sell) in the P2P exchange system.

class Order {
  /**
   * Constructs a new Order object.
   * @param {Object} orderDetails - The details of the order.
   * @param {string} orderDetails.type - The type of the order: 'buy' or 'sell'.
   * @param {number} orderDetails.price - The price at which the order is placed.
   * @param {number} orderDetails.quantity - The quantity of the order.
   * @param {number} [orderDetails.timestamp=Date.now()] - The timestamp when the order was created (default is the current time).
   */
  constructor({ type, price, quantity, timestamp = Date.now() }) {
    // Validate the order type
    if (!["buy", "sell"].includes(type)) {
      throw new Error(`Invalid order type: ${type}. Must be 'buy' or 'sell'.`);
    }

    // Validate price and quantity are positive numbers
    if (price <= 0 || quantity <= 0) {
      throw new Error("Price and quantity must be positive numbers.");
    }

    // Set the order properties
    this.type = type;
    this.price = price;
    this.quantity = quantity;
    this.timestamp = timestamp;
    this.orderId = this.generateOrderId();
  }

  /**
   * Generates a unique order ID for the order.
   * @returns {string} - The unique order ID.
   */
  generateOrderId() {
    // Generate a simple unique ID using the timestamp and a random number
    return `${this.type}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  /**
   * Returns a string representation of the order.
   * Useful for logging and debugging purposes.
   * @returns {string} - The string representation of the order.
   */
  toString() {
    return `Order [ID: ${
      this.orderId
    }] - Type: ${this.type.toUpperCase()}, Price: ${this.price}, Quantity: ${
      this.quantity
    }, Timestamp: ${new Date(this.timestamp).toISOString()}`;
  }
}

module.exports = Order;

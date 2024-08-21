// OrderMatcher.test.js
// This file contains unit tests for the OrderMatcher class, focusing on matching logic for buy and sell orders.

const OrderMatcher = require("../src/client/OrderMatcher");
const Order = require("../src/client/Order");

describe("OrderMatcher", () => {
  describe("match()", () => {
    test("should fully match an incoming buy order with available sell orders", () => {
      const sellOrders = [
        new Order({ type: "sell", price: 90, quantity: 5 }),
        new Order({ type: "sell", price: 100, quantity: 3 }),
      ];

      const incomingBuyOrder = new Order({
        type: "buy",
        price: 100,
        quantity: 8,
      });

      const matchCondition = (sellOrder, buyOrder) =>
        sellOrder.price <= buyOrder.price;

      const result = OrderMatcher.match(
        incomingBuyOrder,
        sellOrders,
        matchCondition
      );

      // Expect the orders to be fully matched
      expect(result.matchedOrders.length).toBe(2);

      // First match with 5 units at price 90
      expect(result.matchedOrders[0]).toMatchObject({
        price: 90,
        quantity: 5,
      });

      // Second match with 3 units at price 100
      expect(result.matchedOrders[1]).toMatchObject({
        price: 100,
        quantity: 3,
      });

      // Expect the remaining quantity to be 0
      expect(result.remainingQuantity).toBe(0);
    });

    test("should partially match an incoming buy order and leave the remainder", () => {
      const sellOrders = [
        new Order({ type: "sell", price: 90, quantity: 5 }),
        new Order({ type: "sell", price: 100, quantity: 3 }),
      ];

      const incomingBuyOrder = new Order({
        type: "buy",
        price: 100,
        quantity: 10,
      });

      const matchCondition = (sellOrder, buyOrder) =>
        sellOrder.price <= buyOrder.price;

      const result = OrderMatcher.match(
        incomingBuyOrder,
        sellOrders,
        matchCondition
      );

      // Expect the orders to be partially matched
      expect(result.matchedOrders.length).toBe(2);

      // First match with 5 units at price 90
      expect(result.matchedOrders[0]).toMatchObject({
        price: 90,
        quantity: 5,
      });

      // Second match with 3 units at price 100
      expect(result.matchedOrders[1]).toMatchObject({
        price: 100,
        quantity: 3,
      });

      // Expect the remaining quantity to be 2
      expect(result.remainingQuantity).toBe(2);
    });

    test("should match an incoming sell order with available buy orders", () => {
      const buyOrders = [
        new Order({ type: "buy", price: 110, quantity: 5 }),
        new Order({ type: "buy", price: 120, quantity: 10 }),
      ];

      const incomingSellOrder = new Order({
        type: "sell",
        price: 115,
        quantity: 7,
      });

      const matchCondition = (buyOrder, sellOrder) =>
        buyOrder.price >= sellOrder.price;

      const result = OrderMatcher.match(
        incomingSellOrder,
        buyOrders,
        matchCondition
      );

      // Expect the orders to be partially matched
      expect(result.matchedOrders.length).toBe(1);

      // First match with 7 units at price 120 (since this is the highest buy order that can match)
      expect(result.matchedOrders[0]).toMatchObject({
        price: 120,
        quantity: 7,
      });

      // Expect the remaining quantity to be 0 since we sold all 7 units
      expect(result.remainingQuantity).toBe(0);
    });

    test("should fully match an incoming sell order and leave no remainder", () => {
      const buyOrders = [
        new Order({ type: "buy", price: 110, quantity: 5 }),
        new Order({ type: "buy", price: 120, quantity: 10 }),
      ];

      const incomingSellOrder = new Order({
        type: "sell",
        price: 110,
        quantity: 5,
      });

      const matchCondition = (buyOrder, sellOrder) =>
        buyOrder.price >= sellOrder.price;

      const result = OrderMatcher.match(
        incomingSellOrder,
        buyOrders,
        matchCondition
      );

      // Expect the orders to be fully matched
      expect(result.matchedOrders.length).toBe(1);

      // Match with 5 units at price 120 (since the higher price takes precedence)
      expect(result.matchedOrders[0]).toMatchObject({
        price: 120, // This is the best available buy price, so it gets matched first
        quantity: 5,
      });

      // Expect the remaining quantity to be 0
      expect(result.remainingQuantity).toBe(0);
    });

    test("should not match an incoming buy order if no suitable sell orders are available", () => {
      const sellOrders = [
        new Order({ type: "sell", price: 110, quantity: 5 }),
        new Order({ type: "sell", price: 120, quantity: 10 }),
      ];

      const incomingBuyOrder = new Order({
        type: "buy",
        price: 100,
        quantity: 10,
      });

      const matchCondition = (sellOrder, buyOrder) =>
        sellOrder.price <= buyOrder.price;

      const result = OrderMatcher.match(
        incomingBuyOrder,
        sellOrders,
        matchCondition
      );

      // Expect no orders to be matched
      expect(result.matchedOrders.length).toBe(0);

      // Expect the remaining quantity to be the full order amount
      expect(result.remainingQuantity).toBe(10);
    });

    test("should not match an incoming sell order if no suitable buy orders are available", () => {
      const buyOrders = [
        new Order({ type: "buy", price: 90, quantity: 5 }),
        new Order({ type: "buy", price: 100, quantity: 10 }),
      ];

      const incomingSellOrder = new Order({
        type: "sell",
        price: 110,
        quantity: 5,
      });

      const matchCondition = (buyOrder, sellOrder) =>
        buyOrder.price >= sellOrder.price;

      const result = OrderMatcher.match(
        incomingSellOrder,
        buyOrders,
        matchCondition
      );

      // Expect no orders to be matched
      expect(result.matchedOrders.length).toBe(0);

      // Expect the remaining quantity to be the full order amount
      expect(result.remainingQuantity).toBe(5);
    });
  });
});

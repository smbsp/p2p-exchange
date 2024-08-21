// OrderBook.test.js
// This file contains unit tests for the OrderBook class, focusing on adding orders, sorting, and matching functionality.

const OrderBook = require("../src/client/OrderBook");
const Order = require("../src/client/Order");

describe("OrderBook", () => {
  let orderBook;

  // Setup a new OrderBook instance before each test
  beforeEach(() => {
    orderBook = new OrderBook();
  });

  describe("addOrder()", () => {
    test("should add a buy order to the buyOrders list and sort by price in descending order", () => {
      const buyOrder1 = new Order({ type: "buy", price: 100, quantity: 10 });
      const buyOrder2 = new Order({ type: "buy", price: 150, quantity: 5 });
      const buyOrder3 = new Order({ type: "buy", price: 120, quantity: 20 });

      orderBook.addOrder(buyOrder1);
      orderBook.addOrder(buyOrder2);
      orderBook.addOrder(buyOrder3);

      // Expect buy orders to be sorted in descending order by price
      expect(orderBook.buyOrders).toEqual([buyOrder2, buyOrder3, buyOrder1]);
    });

    test("should add a sell order to the sellOrders list and sort by price in ascending order", () => {
      const sellOrder1 = new Order({ type: "sell", price: 200, quantity: 10 });
      const sellOrder2 = new Order({ type: "sell", price: 150, quantity: 5 });
      const sellOrder3 = new Order({ type: "sell", price: 180, quantity: 20 });

      orderBook.addOrder(sellOrder1);
      orderBook.addOrder(sellOrder2);
      orderBook.addOrder(sellOrder3);

      // Expect sell orders to be sorted in ascending order by price
      expect(orderBook.sellOrders).toEqual([
        sellOrder2,
        sellOrder3,
        sellOrder1,
      ]);
    });
  });

  describe("matchOrder()", () => {
    test("should match a buy order against sell orders and return the matched orders", () => {
      const sellOrder1 = new Order({ type: "sell", price: 90, quantity: 5 });
      const sellOrder2 = new Order({ type: "sell", price: 100, quantity: 10 });
      orderBook.addOrder(sellOrder1);
      orderBook.addOrder(sellOrder2);

      const buyOrder = new Order({ type: "buy", price: 100, quantity: 8 });

      const matchedOrders = orderBook.matchOrder(buyOrder);

      // Expect two matches: one fully matching sellOrder1 and partially matching sellOrder2
      expect(matchedOrders.length).toBe(2);
      expect(matchedOrders[0]).toMatchObject({
        price: 90,
        quantity: 5,
      });
      expect(matchedOrders[1]).toMatchObject({
        price: 100,
        quantity: 3,
      });

      // Expect remaining quantity of sellOrder2 to be 7 (10 - 3)
      expect(orderBook.sellOrders[0].quantity).toBe(7);
    });

    test("should add the remaining quantity of a buy order back to the buyOrders list if not fully matched", () => {
      const sellOrder = new Order({ type: "sell", price: 100, quantity: 5 });
      orderBook.addOrder(sellOrder);

      const buyOrder = new Order({ type: "buy", price: 100, quantity: 10 });

      orderBook.matchOrder(buyOrder);

      // Expect remaining 5 units of the buy order to be added back to the buyOrders list
      expect(orderBook.buyOrders.length).toBe(1);
      expect(orderBook.buyOrders[0].quantity).toBe(5);
      expect(orderBook.buyOrders[0].price).toBe(100);
    });

    test("should match a sell order against buy orders and return the matched orders", () => {
      const buyOrder1 = new Order({ type: "buy", price: 120, quantity: 10 });
      const buyOrder2 = new Order({ type: "buy", price: 110, quantity: 5 });
      orderBook.addOrder(buyOrder1);
      orderBook.addOrder(buyOrder2);

      const sellOrder = new Order({ type: "sell", price: 115, quantity: 8 });

      const matchedOrders = orderBook.matchOrder(sellOrder);

      // Expect one match: partially matching buyOrder1
      expect(matchedOrders.length).toBe(1);
      expect(matchedOrders[0]).toMatchObject({
        price: 120,
        quantity: 8,
      });

      // Expect remaining quantity of buyOrder1 to be 2 (10 - 8)
      expect(orderBook.buyOrders[0].quantity).toBe(2);
    });

    test("should add the remaining quantity of a sell order back to the sellOrders list if not fully matched", () => {
      const buyOrder = new Order({ type: "buy", price: 100, quantity: 5 });
      orderBook.addOrder(buyOrder);

      const sellOrder = new Order({ type: "sell", price: 100, quantity: 10 });

      orderBook.matchOrder(sellOrder);

      // Expect remaining 5 units of the sell order to be added back to the sellOrders list
      expect(orderBook.sellOrders.length).toBe(1);
      expect(orderBook.sellOrders[0].quantity).toBe(5);
      expect(orderBook.sellOrders[0].price).toBe(100);
    });
  });
});

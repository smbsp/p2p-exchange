// ClientNode.test.js
// This file contains unit tests for the ClientNode class, focusing on order submission, order matching, and network communication.

const ClientNode = require("../src/client/ClientNode");
const OrderBook = require("../src/client/OrderBook");
const Order = require("../src/client/Order");
const NetworkManager = require("../src/client/NetworkManager");

// Mocking the NetworkManager and Logger
jest.mock("../src/client/NetworkManager");
jest.mock("../src/utils/Logger.js", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

describe("ClientNode", () => {
  let clientNode;
  let mockPeerClient;
  let mockNetworkManager;

  // Setup a mock environment before each test
  beforeEach(() => {
    // Create a mock PeerRPCClient object
    mockPeerClient = {
      request: jest.fn(),
      listen: jest.fn(),
    };

    // Mock the NetworkManager instance and its methods
    mockNetworkManager = new NetworkManager(mockPeerClient);
    mockNetworkManager.sendOrder = jest.fn((order, callback) =>
      callback(null, { status: "ok" })
    );
    mockNetworkManager.listenForOrders = jest.fn();

    // Create an instance of ClientNode, injecting the mock dependencies
    clientNode = new ClientNode(mockPeerClient);
    clientNode.networkManager = mockNetworkManager;
  });

  afterEach(() => {
    // Cleanup code to stop the client node
    clientNode.stop();
    process.removeAllListeners("submitOrder");
  });

  describe("Order Submission and Matching", () => {
    test("should submit a new order and match it locally if possible", async () => {
      const testOrder = { type: "buy", price: 100, quantity: 5 };

      // Await directly if `submitOrder` is changed to an async function, or use events as shown above
      await process.emit("submitOrder", testOrder);
      await new Promise((r) => setTimeout(r, 0)); // Wait for any asynchronous operations to complete

      expect(clientNode.networkManager.sendOrder).toHaveBeenCalledWith(
        expect.any(Order),
        expect.any(Function)
      );
    });

    test("should add the remaining unmatched quantity of an order to the order book", () => {
      // Mocking the addOrder and matchOrder methods of OrderBook
      clientNode.orderBook.addOrder = jest.fn();
      clientNode.orderBook.matchOrder = jest.fn().mockReturnValue([]);

      // Creating a test order
      const testOrder = { type: "buy", price: 100, quantity: 10 };

      // Emit the event to submit the order
      process.emit("submitOrder", testOrder);

      // Expect the order to be unmatched and added back to the order book
      expect(clientNode.orderBook.matchOrder).toHaveBeenCalledWith(
        expect.any(Order)
      );
      expect(clientNode.orderBook.addOrder).toHaveBeenCalledWith(
        expect.any(Order)
      );

      // Expect the order to be broadcasted to the network
      expect(clientNode.networkManager.sendOrder).toHaveBeenCalledWith(
        expect.any(Order),
        expect.any(Function)
      );
    });
  });

  describe("Network Communication", () => {
    test("should broadcast an order to the network after submission", () => {
      // Creating a test order
      const testOrder = { type: "buy", price: 100, quantity: 5 };

      // Emit the event to submit the order
      process.emit("submitOrder", testOrder);

      // Expect the order to be broadcasted to the network
      expect(clientNode.networkManager.sendOrder).toHaveBeenCalledWith(
        expect.any(Order),
        expect.any(Function)
      );
    });

    test("should listen for incoming orders and process them", () => {
      // Mocking the orderBook's matchOrder and addOrder methods
      clientNode.orderBook.matchOrder = jest.fn().mockReturnValue([]);
      clientNode.orderBook.addOrder = jest.fn();

      // Simulate receiving an incoming order
      const incomingOrderData = { type: "sell", price: 90, quantity: 5 };
      mockNetworkManager.listenForOrders.mockImplementation((callback) => {
        callback(null, new Order(incomingOrderData));
      });

      // Call the method that listens for incoming orders
      clientNode.listenForIncomingOrders();

      // Expect the incoming order to be processed and added to the order book
      expect(clientNode.orderBook.matchOrder).toHaveBeenCalledWith(
        expect.any(Order)
      );
      expect(clientNode.orderBook.addOrder).toHaveBeenCalledWith(
        expect.any(Order)
      );
    });

    test("should handle errors when receiving orders from the network", () => {
      // Mock the logger
      const Logger = require("../src/utils/Logger");

      // Simulate an error in receiving orders
      mockNetworkManager.listenForOrders.mockImplementation((callback) => {
        callback(new Error("Network Error"), null);
      });

      // Call the method that listens for incoming orders
      clientNode.listenForIncomingOrders();

      // Expect the error to be logged
      expect(Logger.error).toHaveBeenCalledWith(
        "Error receiving order:",
        expect.any(Error)
      );
    });
  });
});

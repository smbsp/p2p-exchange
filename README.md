# P2P Distributed Exchange

## Overview

This project is a simplified P2P distributed exchange system that allows multiple client nodes to communicate and trade orders without relying on a centralized server. Each client node maintains its own order book, handles order matching locally, and communicates with other nodes in a decentralized network using Grenache (a lightweight DHT-based microservice framework).

## Key Features

- **Decentralized Architecture**: No central server—each client node is independent and communicates via a DHT network.
- **In-Memory Order Book**: Orders are stored and matched locally in memory, with no need for persistent storage.
- **Real-time Order Propagation**: Orders are propagated across all nodes using Grenache for efficient order matching.
- **Simple Order Matching Engine**: Basic matching logic for buy and sell orders, with support for partial matches.
- **Modular and Extensible Design**: The codebase is designed for scalability and easy extension.

## Project Structure

```
p2p-exchange/
│
├── src/
│   ├── client/
│   │   ├── ClientNode.js         # Core logic for the client node
│   │   ├── Order.js              # Defines the structure and behavior of an order
│   │   ├── OrderBook.js          # Handles order management and matching logic
│   │   ├── OrderMatcher.js       # Contains the matching engine logic
│   │   ├── NetworkManager.js     # Manages network communication between nodes
│   │
│   ├── config/
│   │   └── grenache-config.js    # Configuration settings for connecting to the Grape DHT
│   │
│   ├── utils/
│   │   └── Logger.js             # Logging utility for consistent logging across the system
│   │
│   ├── server/
│   │   └── GrapeNodeSetup.js     # Script for programmatically setting up and managing Grape nodes
│   │
│   └── index.js                  # Main entry point for running the client node
│
├── grape-scripts/
│   ├── start-grape-1.sh          # Script to start the first Grape node
│   ├── start-grape-2.sh          # Script to start the second Grape node
│   └── README.md                 # Instructions for using the Grape node scripts
│
├── tests/
│   ├── ClientNode.test.js        # Unit tests for ClientNode
│   ├── OrderBook.test.js         # Unit tests for OrderBook
│   ├── OrderMatcher.test.js      # Unit tests for OrderMatcher
│
├── logs/                         # Directory where logs are stored (created automatically)
│
├── package.json                  # Node.js package dependencies and scripts
├── README.md                     # Project documentation (this file)
└── .gitignore                    # Files and directories to ignore in version control
```

## Getting Started

### Prerequisites

Ensure that you have Node.js and npm installed on your system. You also need to install Grenache globally:

```bash
npm install -g grenache-grape
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/smbsp/p2p-exchange.git
cd p2p-exchange
```

2. Install the project dependencies:

```bash
npm install
```

### Running the Grape Nodes

You need at least two Grape nodes running to form the DHT network.

1. Navigate to the grape-scripts/ directory:

```bash
cd grape-scripts
```

2. Start the first Grape node:

```bash
./start-grape-1.sh
```

3. In a new terminal, start the second Grape node:

```bash
./start-grape-2.sh
```

These nodes will connect and form the DHT network, enabling client nodes to communicate.

For more details, see the grape-scripts/README.md file.

### Running the Client Node

1. Go back to the root directory:

```bash
cd ..
```

2. Start the client node:

```bash
node src/index.js
```

This will launch a client node that connects to the Grape DHT network, allowing it to send and receive orders.

### Example Usage

A sample order is submitted programmatically when the client node starts. You can modify the index.js file to submit custom orders or integrate user input.

### Testing

The project uses Jest for unit testing. Run the following command to execute all tests:

```bash
npm test
```

### Logs

Logs are automatically generated and stored in the logs/ directory. Both console and file logs are supported. You can customize the logging behavior by modifying the utils/Logger.js file.

### Configuration

All configuration settings related to the Grape DHT network and client behavior are stored in src/config/grenache-config.js. You can adjust settings like the Grape address, RPC timeout, and announce interval based on your environment.

## Project Highlights

- **Extensible Design**: The codebase is designed with modular components (e.g., order matching, network communication) that can be easily extended or replaced.
- **Error Handling and Logging**: Comprehensive error handling and logging mechanisms ensure smooth operation and easy debugging.
- **Unit Testing**: The core logic is thoroughly unit tested, providing confidence in the reliability and correctness of the system.

## Future Enhancements

Potential features that could be added in the future include:

- Advanced order types (e.g., market orders, stop orders).
- Enhanced error handling and fault tolerance in the network communication.
- Support for persistent order books with database integration.
- Visualization or UI integration for monitoring and submitting orders.

## Troubleshooting

- If the client node fails to connect, verify that the Grape nodes are running and that the correct bootstrap addresses are being used.
- Ensure that the ports used by the Grape nodes are not occupied by other processes.

## Contributing

Contributions are welcome! If you would like to contribute, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

Special thanks to the Grenache and Bitfinex teams for providing the foundation for this project.

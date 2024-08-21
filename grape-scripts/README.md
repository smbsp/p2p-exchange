# Grape Node Scripts

This folder contains scripts to start two Grape nodes, which form the backbone of the Distributed Hash Table (DHT) network for the P2P exchange system. These nodes enable client nodes to discover each other and communicate within the decentralized network.

## How to Use

### Prerequisites

1. Ensure that you have [Grenache](https://github.com/bitfinexcom/grenache) installed. You can install it globally using npm:

   ```bash
   npm install -g grenache-grape
   ```

2. Make sure you have cloned this repository and navigated to the `grape-scripts/` directory.

### Starting the Grape Nodes

1. **Start the First Grape Node:**

   Run the following command in the terminal:

   ```bash
   ./start-grape-1.sh
   ```

   This will start the first Grape node with:

   - DHT port: `20001`
   - API port: `30001`
   - Bootstrap node: `127.0.0.1:20002` (the address of the second Grape node)

   This node will look for the second node to form the DHT network.

2. **Start the Second Grape Node:**

   In a separate terminal, run the following command:

   ```bash
   ./start-grape-2.sh
   ```

   This will start the second Grape node with:

   - DHT port: `20002`
   - API port: `40001`
   - Bootstrap node: `127.0.0.1:20001` (the address of the first Grape node)

   Once both nodes are running, they will connect to each other, forming the decentralized DHT network.

### Monitoring the Nodes

While the scripts are running, you can monitor the logs in the terminal. Look for messages indicating that the nodes have successfully connected to each other.

### Stopping the Nodes

To stop a Grape node, simply press `Ctrl+C` in the terminal where the script is running.

### Troubleshooting

- Ensure that the ports used by the Grape nodes are not occupied by other processes.
- If the nodes fail to connect, verify that the bootstrap addresses in the scripts are correct.

### Further Customization

You can adjust the DHT and API ports or bootstrap addresses in the scripts as needed. For more advanced configurations, consult the [Grenache documentation](https://github.com/bitfinexcom/grenache).

### Additional Notes

- These scripts assume you are running the Grape nodes on a single machine (localhost). If you wish to run the nodes on different machines, update the bootstrap addresses accordingly.
- If you need more than two Grape nodes, you can create additional scripts using different port configurations.

### Conclusion

These scripts provide a simple way to set up the Grape DHT network, which is essential for the P2P exchange system. Once the Grape nodes are running, client nodes can connect and participate in the decentralized exchange.

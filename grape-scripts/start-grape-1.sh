#!/bin/bash
# start-grape-1.sh
# This script starts the first Grape node with the specified ports and bootstrap configuration.

# Start the Grape node with DHT and API ports, and connect it to the second Grape node
grape --dp 20001 --aph 30001 --bn '127.0.0.1:20002'

# Explanation:
# --dp: Port for DHT communication (20001)
# --aph: Port for the Grape API (30001)
# --bn: Bootstrap node address (second Grape node) to form the DHT network (127.0.0.1:20002)

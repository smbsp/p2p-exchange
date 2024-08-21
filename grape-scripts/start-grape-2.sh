#!/bin/bash
# start-grape-2.sh
# This script starts the second Grape node with the specified ports and bootstrap configuration.

# Start the Grape node with DHT and API ports, and connect it to the first Grape node
grape --dp 20002 --aph 40001 --bn '127.0.0.1:20001'

# Explanation:
# --dp: Port for DHT communication (20002)
# --aph: Port for the Grape API (40001)
# --bn: Bootstrap node address (first Grape node) to form the DHT network (127.0.0.1:20001)

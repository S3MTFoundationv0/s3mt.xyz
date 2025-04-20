#!/bin/bash
set -e

echo "Starting Solana test validator..."

# Set RPC bind address to listen on all interfaces
# Disable BPF JIT for faster startup on Mac M[x] machines

solana-test-validator \
  --rpc-port 8899 \
  --bind-address 0.0.0.0 \
  --ledger /solana/ledger \
  --faucet-sol 1000 \
  --reset \
  "$@" 
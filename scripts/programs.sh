#!/bin/bash

# Check if the local validator container is running
container_name="s3mt-foundation-validator"
if ! docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
    echo "Validator is not running. Use 'make up s=validator' to start it." >&2
    exit 1
fi

# RPC endpoint for the local validator
rpc_url="http://127.0.0.1:8899"

# Loader program IDs to query
bpf_loader="BPFLoader1111111111111111111111111111111111"
upgradeable_loader="BPFLoaderUpgradeab1e11111111111111111111111"

# Check for solana CLI availability
have_solana=false
if command -v solana >/dev/null 2>&1; then
    have_solana=true
fi

# Helper function to list programs for a given loader
list_programs() {
    local loader_id="$1"
    echo "Programs loaded by loader ${loader_id}:"
    # Fetch program account pubkeys
    local pubkeys=( $(curl -s -X POST -H 'Content-Type: application/json' \
        -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"getProgramAccounts\",\"params\":[\"${loader_id}\",{\"encoding\":\"base58\"}]}" \
        "$rpc_url" \
        | grep -o '"pubkey"[[:space:]]*:[[:space:]]*"[^"]*"' \
        | awk -F '"' '{print $4}' ) )
    if [ ${#pubkeys[@]} -eq 0 ]; then
        echo "  (none)"
        echo
        return
    fi
    # List program pubkeys
    for pk in "${pubkeys[@]}"; do
        echo "  - $pk"
    done
    # Show detailed info if solana CLI is available
    if [ "$have_solana" = true ]; then
        echo
        echo "Program details:"
        for pk in "${pubkeys[@]}"; do
            echo "=== $pk ==="
            solana program show --url "$rpc_url" "$pk"
            echo
        done
    else
        echo
        echo "Install solana-cli to see program details"
        echo
    fi
}

# List programs for both non-upgradeable and upgradeable BPF loaders
list_programs "$bpf_loader"
list_programs "$upgradeable_loader"
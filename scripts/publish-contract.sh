#!/usr/bin/env bash
# Publish Rentinel contract to Sui testnet
# Prerequisites: sui CLI, testnet SUI (get from https://faucet.sui.io/)

set -e
cd "$(dirname "$0")/.."

echo "Building contract..."
sui move build -p rentinel_contract

echo ""
echo "Publishing to testnet (requires testnet SUI for gas)..."
sui client publish rentinel_contract --gas-budget 100000000

echo ""
echo "✓ Copy the PackageID from 'Published Objects' above."
echo "  Add to frontend/.env:"
echo "  VITE_RENTINEL_PACKAGE_ID=<PackageID>"
echo ""
echo "  Then restart the frontend dev server."

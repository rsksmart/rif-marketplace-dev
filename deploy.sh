#!/bin/sh

RNS_DIR="./rns-dev"
BASE_DIR=$(pwd)

# Migrate RNS deployment
cd "$RNS_DIR"
npx truffle migrate --network ganache --reset

# Copy and create config
cd "$BASE_DIR"
node scripts/createConfig.js

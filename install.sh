#!/bin/sh

RNS_DIR="./rns-dev"
BASE_DIR=$(pwd)

# Install dependencies for RNS deployment
cd "$RNS_DIR"
rm -rf node_modules package-lock.json
npm i

#!/bin/sh

curl -H "Content-Type: application/json" -X POST --data \
        '{"id":1337,"jsonrpc":"2.0","method":"evm_increaseTime","params":[60]}' \
        http://localhost:8545

curl -H "Content-Type: application/json" -X POST --data \
        '{"id":1337,"jsonrpc":"2.0","method":"evm_mine"}' \
        http://localhost:8545

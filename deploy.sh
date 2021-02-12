#!/bin/sh

if [[ $# -eq 0 ]] ; then
    echo 'Please specify the services to deploy. Services available: "rns" "storage" "triggers".'
    exit 1
fi

BASE_DIR=$(pwd)

for i in "$@"
do
    cd "$BASE_DIR"
    if [ $i == "rns" ] || [ $i == "storage" ] || [ $i == "triggers" ] ;  then
        SERVICE_DIR="./"$i"-dev"

        # Migrate deployment
        cd "$SERVICE_DIR"
        npx truffle migrate --network ganache --reset
    fi
done

# Copy and create config files for services
cd "$BASE_DIR"
node scripts/createConfig.js "$@"


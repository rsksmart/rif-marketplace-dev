#!/bin/sh

if [[ $# -eq 0 ]] ; then
    echo 'Please specify the services to deploy. Services available: "rns" "storage".'
    exit 1
fi

BASE_DIR=$(pwd)

STORAGE="storage"
RNS="rns"

SERVICES=($STORAGE $RNS)

if (( $# == 1 && $1 == "all")) ; then
	for service in "${SERVICES[@]}"
	do
		echo "----------------------------"
		echo "Deploying $service contracts"
		cd "$BASE_DIR/$service-dev"

		# Migrage deployment
		npx truffle migrate --network ganache --reset; exitCode=$?
		if (($exitCode == 0)); then
			echo "$service contracts deployed"
		else
			echo "Migration of $service contracts failed!"
			exit 1
		fi
		echo "---------------------------"
	done

	cd "$BASE_DIR"
	echo "Creating config files for $SERVICES"
	node scripts/createConfig.js "${SERVICES[@]}"
	echo "Done"
	exit 0
fi

for i in "$@"
do
    cd "$BASE_DIR" 
    if [ $i == "rns" ] || [ $i == "storage" ] ;  then
        SERVICE_DIR="./"$i"-dev"
        
        # Migrate deployment
        cd "$SERVICE_DIR"
        npx truffle migrate --network ganache --reset      
    fi
done

# Copy and create config files for services
cd "$BASE_DIR" 
node scripts/createConfig.js "$@"


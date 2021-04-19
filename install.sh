#!/bin/sh

if [[ $# -eq 0 ]] ; then
    echo 'Please specify the services to install. Services available: "rns" "storage" "notifier".'
    exit 1
fi

BASE_DIR=$(pwd)

for i in "$@"
do
   cd "$BASE_DIR"
   if [ $i == "rns" ] || [ $i == "storage" ] || [ $i == "notifier" ] ;  then
        SERVICE_DIR="./"$i"-dev"

        cd "$SERVICE_DIR"
        rm -rf node_modules package-lock.json
        npm i
   fi
done



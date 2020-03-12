# Local development environment for RIF Marketplace services

## Requeriments

- [Docker](https://www.docker.com/)
- [Docker compose](https://docs.docker.com/compose/install/)

## Usage

### Start

```ssh
docker-compose up
```

### Stop

Ctrl+C or this command at the same path of docker-compose file

```ssh
docker-compose stop
```


## Provided services

- RSKj node (regtest network)
- Database (postgres)
- adminer (UI for database management, similar to phpMyAdmin)

# Data folder

The folder `./data` contains the current mounted file system for each service:

- /db - current db files
- /rskj
    - /database - rskj blockchain db files
    - /logs - contains the logs

> You can remove the data folder for a fresh start.

#
# RSK Node Dockerfile
#

# Pull base image.
FROM ubuntu:latest

MAINTAINER RSK Release <support@rsk.co>

ARG DEBIAN_FRONTEND=noninteractive

# 1. Install software-properties-common so that we can use add-apt-repository
# 2. add openjdk-r repository with add-apt-repository to prepare to install openjdk-8-jdk 
# 3. Install openjdk-8-jdk to update rsk.jar later
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:openjdk-r/ppa && \
    apt-get install -y --no-install-recommends openjdk-8-jdk supervisor systemd

# Install RSK.
RUN groupadd --gid 888 rsk && useradd rsk -d /var/lib/rsk -s /sbin/nologin --uid=888 --gid=888

RUN \
  add-apt-repository -y ppa:rsksmart/rskj && \
  apt-get update && \
  (echo rskj shared/accepted-rsk-license-v1-1 select true | /usr/bin/debconf-set-selections ) && \
  apt-get install -y --no-install-recommends rskj && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  rm -f /etc/rsk/node.conf && \
  ln -s /etc/rsk/regtest.conf /etc/rsk/node.conf

# Copy regtest.conf over to enable websocket connection
COPY regtest.conf /etc/rsk/regtest.conf

# Copy rsk-dev.json over to update initial balance of wallet addresses
RUN mkdir -p /usr/share/rsk/genesis
COPY rsk-dev.json /usr/share/rsk/genesis/rsk-dev.json
RUN cd /usr/share/rsk && jar uf rsk.jar genesis/rsk-dev.json

# Supervisod CONF
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 4444
EXPOSE 4445
EXPOSE 30305

# Define default command.
CMD ["/usr/bin/supervisord"]

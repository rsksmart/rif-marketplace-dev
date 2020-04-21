module.exports = {

  networks: {
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },

    local: {
      host: "127.0.0.1",
      port: 4444,
      network_id: "*"
    }
  },

  mocha: {
  },

  compilers: {
    solc: {
    }
  }
}

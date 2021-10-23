const HDWalletProvider = require("@truffle/hdwallet-provider");
require('dotenv').config()

module.exports = {
    contracts_directory: "./contracts/",
    plugins: [
        'truffle-plugin-verify'
      ],
      api_keys: {
        etherscan: process.env.ETHERSCAN_KEY
      },
    networks: {
        ganache: {
            host: "localhost",
            port: 7545,
            gas: 5000000,
            gasPrice: 15000000000,
            network_id: "*", // Match any network id
        },
        rinkeby: {
            provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.PROVIDER),
            network_id: 4,
            confirmations: 2,
            gasPrice: "100000000000",
            timeoutBlocks: 200,
            skipDryRun: true
        },
        ethereum: {
            provider: () => new HDWalletProvider(process.env.MNEMONIC, process.env.PROVIDER),
            network_id: 1,
            confirmations: 2,
            timeoutBlocks: 200,
            gasPrice: "100000000000",
            skipDryRun: true
        }
    },
    mocha: {
        reporter: "eth-gas-reporter",
        reporterOptions: {
            currency: "USD",
            gasPrice: 2,
        },
    },
    compilers: {
        solc: {
            version: "0.8.6"
        },
    },
};
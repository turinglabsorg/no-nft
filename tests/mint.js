const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
require('dotenv').config()
const MNEMONIC = process.env.GANACHE_MNEMONIC;
const NFT_CONTRACT_ADDRESS = process.env.GANACHE_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.GANACHE_OWNER_ADDRESS;
const NFT_CONTRACT_ABI = require('../abi.json')
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs')
const configs = JSON.parse(fs.readFileSync('./configs/' + argv._ + '.json').toString())

async function main(minter) {
    if (configs.owner_mnemonic !== undefined) {
        const provider = new HDWalletProvider(
            configs.owner_mnemonic,
            configs.provider
        );
        const web3Instance = new web3(provider);

        const nftContract = new web3Instance.eth.Contract(
            NFT_CONTRACT_ABI,
            configs.contract_address, { gasLimit: "5000000" }
        );
        let totalSupply = 0
        while (totalSupply < 100) {
            totalSupply = await nftContract.methods.totalSupply().call()
            console.log('Total supply is: ' + totalSupply)
            let toMint = 100 - parseInt(totalSupply)
            console.log('Need to mint ' + toMint + ' NFTs')
            try {
                const nonce = await web3Instance.eth.getTransactionCount(configs.owner_address)
                console.log('Trying minting NFT with nonce ' + nonce + '...')
                const result = await nftContract.methods
                    .buyNFT()
                    .send({ from: minter, nonce: nonce, value: web3Instance.utils.toWei("0.01","ether"), gasPrice: "100000000000" });
                console.log("NFT minted! Transaction: " + result.transactionHash);
            } catch (e) {
                console.log(e)
            }
        }
    } else {
        console.log('Please provide `owner_mnemonic` first.')
    }

}

if (argv._ !== undefined) {
    let minters = [configs.owner_address]
    for (let k in minters) {
        main(minters[k]);
    }
} else {
    console.log('Provide a deployed contract first.')
}
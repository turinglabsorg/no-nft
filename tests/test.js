const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
require('dotenv').config()
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs')
const contract_name = argv._[0]
const NFT_CONTRACT_ABI = require('../abi.json')

async function main() {
    try {
        const configs = JSON.parse(fs.readFileSync('./configs/' + argv._ + '.json').toString())
        const provider = new HDWalletProvider(
            configs.owner_mnemonic,
            configs.provider
        );
        const web3Instance = new web3(provider);
        const nftContract = new web3Instance.eth.Contract(
            NFT_CONTRACT_ABI,
            configs.contract_address, { gasLimit: "10000000" }
        );
        console.log('Testing contract: ' + argv._)
        console.log('--')
        console.log('CONTRACT ADDRESS IS:', configs.contract_address)
        const owner = await nftContract.methods.owner().call();
        console.log('OWNER IS:', owner)
        const name = await nftContract.methods.name().call();
        const symbol = await nftContract.methods.symbol().call();
        console.log('DETAILS: ', name, '(' + symbol + ')');
        const contractURI = await nftContract.methods.contractURI().call();
        console.log('Contract URI:', contractURI)
        const revealedURI = await nftContract.methods.contract_base_uri().call();
        console.log('Revealed base URI:', revealedURI)
        console.log('--')
        let ended = false
        let i = 1;
        let errors = 0
        console.log('Checking NFTs..')
        while (!ended) {
            try {
                const owner = await nftContract.methods.ownerOf(i).call();
                const uri = await nftContract.methods.tokenURI(i).call();
                console.log('TOKENID: ' + i + ' - ' + uri, 'OWNER IS', owner)
                i++
                errors = 0
            } catch (e) {
                if (i === 1) {
                    console.log('No tokens found.')
                }
                i++
                errors++
                if (errors > 2) {
                    ended = true
                }
            }
        }
        process.exit();
    } catch (e) {
        console.log(e.message)
        process.exit();
    }
}

if (argv._ !== undefined) {
    main();
} else {
    console.log('Provide a deployed contract first.')
}
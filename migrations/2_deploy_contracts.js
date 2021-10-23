const NoNFT = artifacts.require("./NoNFT.sol");
const fs = require('fs')

module.exports = async (deployer, network) => {
    // OpenSea proxy registry addresses for rinkeby and mainnet.
    let proxyRegistryAddress = "";
    if (network === 'rinkeby') {
        proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
    } else if (network === 'ethereum') {
        proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
    } else if (network === 'polygon') {
        proxyRegistryAddress = "0x58807baD0B376efc12F5AD86aAc70E78ed67deaE";
    } else if (network === 'mumbai') {
        proxyRegistryAddress = "0x58807baD0B376efc12F5AD86aAc70E78ed67deaE";
    } else {
        proxyRegistryAddress = "0x0000000000000000000000000000000000000000";
    }

    const contractName = process.env.NAME;
    const contractTicker = process.env.TICKER;
    const contractDescription = process.env.DESCRIPTION;

    await deployer.deploy(NoNFT, proxyRegistryAddress, contractName, contractTicker, contractDescription);
    const contract = await NoNFT.deployed();

    let configs = JSON.parse(fs.readFileSync('./configs/' + network + '.json').toString())
    console.log('Saving address in config file..')
    configs.contract_address = contract.address
    fs.writeFileSync('./configs/' + network + '.json', JSON.stringify(configs, null, 4))
    console.log('--')

};
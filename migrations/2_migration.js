const TscToken = artifacts.require('./TscToken.sol');
const TscBounties = artifacts.require('./TscBounties.sol');
const Whitelist = artifacts.require('./Whitelist.sol');
const TscCrowdsale = artifacts.require('./TscCrowdsale.sol');
const EIP820Registry = require('eip820');

module.exports = function(deployer, network, accounts) {
    deployer.deploy(Whitelist).then(() => {
        if (network === 'development') {
            const Web3Latest = require('web3');
            const web3latest = new Web3Latest('http://localhost:8545');
            return EIP820Registry.deploy(web3latest, accounts[0]);
        } else {
            return null
        }
    })
    .then(() => deployer.deploy(TscToken))
    .then(() => deployer.deploy(TscCrowdsale, TscToken.address, Whitelist.address))
    .then(() => TscToken.deployed())
    .then(token => token.transferOwnership(TscCrowdsale.address))
    .then(() => TscCrowdsale.deployed())
    .then(crowdsale => crowdsale.initialize())
    .then(() => deployer.deploy(TscBounties, TscCrowdsale.address))
}

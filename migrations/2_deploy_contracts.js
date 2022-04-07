const Socialchain = artifacts.require("Socialchain");

module.exports = function (deployer) {
  deployer.deploy(Socialchain);
};

require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  // networks: {
  //   hardhat: {
  //     chainId: 1337,
  //   },
  // },
  solidity: '0.8.4',
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [privateKey],
    },
  },
};


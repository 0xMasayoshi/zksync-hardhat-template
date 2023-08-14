import { HardhatUserConfig } from "hardhat/config";

import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
// Plugins
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "hardhat-abi-exporter";
import "@typechain/hardhat";

import "hardhat-gas-reporter";

// load env file
import dotenv from "dotenv";
dotenv.config();

// dynamically changes endpoints for local tests
const zkSyncTestnet =
  process.env.NODE_ENV == "test"
    ? {
        url: "http://localhost:3050",
        ethNetwork: "http://localhost:8545",
        zksync: true,
        accounts: [
          // rich wallets from local-node https://github.com/matter-labs/local-setup/blob/main/rich-wallets.json
          "0x77268...",
          "0xac1e7...",
        ],
      }
    : {
        url: "https://zksync2-testnet.zksync.dev",
        ethNetwork: "goerli",
        zksync: true,
        accounts: [
          // account PKs loaded from .env file
          process.env.DEPLOY_PRIVATE_KEY,
          process.env.USER_PRIVATE_KEY,
        ],
      };

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.3.8",
    compilerSource: "binary",
    settings: {},
  },
  defaultNetwork: "zksync-era",
  networks: {
    hardhat: {
      zksync: false,
    },
    'zksync-era': {
      url: 'https://mainnet.era.zksync.io', // URL of the zkSync network RPC
      ethNetwork: 'https://eth.llamarpc.com', // Can also be the RPC URL of the Ethereum network (e.g. `https://goerli.infura.io/v3/<API_KEY>`)
      zksync: true,
    },
  },
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000000,
          },
        },
      },
      {
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 10000000,
          },
        },
      },
    ],
  },
  // PLUGINS CONFIG
  namedAccounts: {
    deployer: process.env.DEPLOY_ACCOUNT || "",
    user: process.env.USER_ACCOUNT || "",
  },
  contractSizer: {
    // more info about this plugin in https://www.npmjs.com/package/hardhat-contract-sizer
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  abiExporter: {
    // more info about this plugin in https://www.npmjs.com/package/hardhat-abi-exporter
    path: "./abis",
    runOnCompile: true,
    clear: true,
    flat: true,
    spacing: 2,
    pretty: true,
  },
  typechain: {
    // more info about this plugin in https://www.npmjs.com/package/@typechain/hardhat
    outDir: "typechain",
    target: "ethers-v5",
  },
};

export default config;

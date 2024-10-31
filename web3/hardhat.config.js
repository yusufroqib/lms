require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	solidity: "0.8.24",
	sourcify: {
		enabled: true,
	},
	networks: {
		alfajores: {
			url: process.env.CELO_URL,
			accounts: [`0x${process.env.PRIVATE_KEY}`],
			// chainId: 44787
		},
		celo: {
			url: "https://forno.celo.org",
			accounts: [`0x${process.env.PRIVATE_KEY}`],
		},
	},
	etherscan: {
		apiKey: {
			alfajores: process.env.CELO_SCAN_API_KEY,
			celo: process.env.CELO_SCAN_API_KEY,
		},
		customChains: [
			{
				network: "alfajores",
				chainId: 44787,
				urls: {
					apiURL: "https://api-alfajores.celoscan.io/api",
					browserURL: "https://alfajores.celoscan.io",
				},
			},
			{
				network: "celo",
				chainId: 42220,
				urls: {
					apiURL: "https://api.celoscan.io/api",
					browserURL: "https://celoscan.io/",
				},
			},
		],
	},
};


export const getSource = (vin, otherParams) => {
	return `https://xxxxxxxxxxx${vin}/${otherParams}`
}
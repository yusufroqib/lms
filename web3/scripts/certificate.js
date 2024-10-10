const { ethers } = require("hardhat");

async function main() {
	const certificate = await ethers.deployContract("Certificate");

	await certificate.waitForDeployment();

	// console.log(Certificate)

	console.log("Contract Deployed at " + certificate.target);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

// CA: 0x1FA70d3Ef1F5A0780181A5D698916d5E885525E0



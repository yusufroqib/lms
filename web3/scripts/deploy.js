const { ethers } = require("hardhat");

async function main() {
	const coursePayment = await ethers.deployContract("CoursePayment", [
		"0x7A8674B9c9489086CF8ed01E9C63FBe397531dEc",
	]);

	await coursePayment.waitForDeployment();

	// console.log(coursePayment)

	console.log("Contract Deployed at " + coursePayment.target);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});


// npx hardhat verify [CONTRACT_ADDRESS] [...CONSTRUCTOR_ARGS] --network alfajores
// $ npx hardhat verify 0x3A16cab6f258Ee0385DE64B23Cf3F9E2de838a92 0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B  --network alfajores
// CA CELO: 0x3A16cab6f258Ee0385DE64B23Cf3F9E2de838a92


//CA CROSSFI: 0xDAB933519f2988F0388f0c20Cf1E1308e65aCF4b
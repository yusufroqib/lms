const { ethers } = require("hardhat");

async function main() {
	const coursePayment = await ethers.deployContract("CoursePayment", [
		"0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B",
	]);

	await coursePayment.waitForDeployment();

	// console.log(coursePayment)

	console.log("Contract Deployed at " + coursePayment.target);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});

// CA: 0x3A16cab6f258Ee0385DE64B23Cf3F9E2de838a92



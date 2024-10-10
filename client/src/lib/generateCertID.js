const generateCertID = (userId) => {
	const prefix = "LRNV";
	const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD format

	// Use Web Crypto API for hashing
	const getHash = async (input) => {
		const encoder = new TextEncoder();
		const data = encoder.encode(input);
		const hashBuffer = await crypto.subtle.digest("SHA-256", data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
	};

	// Generate random part
	const randomPart = Array(5)
		.fill(0)
		.map(() => Math.random().toString(36)[2].toUpperCase())
		.join("");

	return getHash(userId).then((hash) => {
		const shortHash = hash.slice(0, 8).toUpperCase();
		return `${prefix}-${datePart}-${shortHash}-${randomPart}`;
	});
};

export default generateCertID;

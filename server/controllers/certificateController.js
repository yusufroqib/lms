const dotenv = require("dotenv");
const Certificate = require("../models/CertificateModel");
const { default: axios } = require("axios");
const pinataSDK = require("@pinata/sdk");
dotenv.config();
const { Readable } = require("stream");

const pinata = new pinataSDK(
	process.env.PINATA_API_KEY,
	process.env.PINATA_SECRET_API_KEY
);

const prepareCertificateData = async (req, res) => {
	try {
		const { courseTitle, studentName } = req.body;
		const { courseId } = req.params;
		const userId = req.userId;

		const existingCertificate = await Certificate.findOne({
			student: userId,
			course: courseId,
		});

		if (!existingCertificate)
			return res
				.status(404)
				.json({ success: false, message: "Certificate not found" });

		if (existingCertificate && existingCertificate.isUploadedToIPFS) {
			if (existingCertificate.isMinted) {
				return res.status(400).json({
					success: false,
					message: "Certificate already minted",
				});
			}
			if (!existingCertificate.isMinted) {
				return res.json({
					success: true,
					tokenURI: existingCertificate.tokenURI,
				});
			}
		}

		const response = await axios.get(existingCertificate.firebaseUrl, {
			responseType: "arraybuffer",
		});
		const imageBuffer = Buffer.from(response.data, "binary");

		// Create a readable stream from the buffer
		const stream = Readable.from(imageBuffer);

		// Upload image to IPFS via Pinata
		const imageResult = await pinata.pinFileToIPFS(stream, {
			pinataMetadata: {
				name: `${courseTitle}_certificate.png`,
			},
			pinataOptions: {
				cidVersion: 0,
			},
		});
		const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageResult.IpfsHash}`;

		// Create metadata
		const metadata = {
			name: `${courseTitle} Certificate`,
			description: `Certificate for ${studentName}`,
			image: imageUrl,
			attributes: [
				{ trait_type: "Course", value: courseTitle },
				{ trait_type: "Student", value: studentName },
				{ trait_type: "Completion Date", value: existingCertificate.date.toISOString() },
			],
		};

		// Upload metadata to IPFS
		const metadataResult = await pinata.pinJSONToIPFS(metadata, {
			pinataMetadata: {
				name: `${courseTitle}_metadata.json`,
			},
		});
		const tokenURI = `https://gateway.pinata.cloud/ipfs/${metadataResult.IpfsHash}`;

		if (existingCertificate) {
			existingCertificate.tokenURI = tokenURI;
			existingCertificate.isUploadedToIPFS = true;
			await existingCertificate.save();
		}
		res.json({ success: true, tokenURI });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, error: error.message });
	}
};

const verifyCertificate = async (req, res) => {
	try {
		const { id } = req.query;

		if (!id) {
			return res
				.status(400)
				.json({ error: "Certificate ID or NFT ID is required" });
		}

		let query;

		// Check if the id is a valid number (for NFTId)
		if (!isNaN(id) && Number.isInteger(Number(id))) {
			query = { NFTId: Number(id) };
		} else {
			// For certificateId, use case-insensitive regex
			query = { certificateId: { $regex: new RegExp("^" + id + "$", "i") } };
		}

		let certificate = await Certificate.findOne(query)
			.populate("student", "name")
			.populate("course", "title");

		if (!certificate) {
			return res.status(404).json({ error: "Certificate not found" });
		}

		res.json(certificate);
	} catch (error) {
		console.error("Error verifying certificate:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


const getUserCertificatePerCourse = async (req, res) => {
	try {
		const userId = req.userId;
		const courseId = req.params.courseId;

		const certificate = await Certificate.findOne({
			student: userId,
			course: courseId,
		});
		// console.log(certificate);

		res.json({ certificate });
	} catch (error) {
		console.error("Error getting user certificate for course:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const getAllUserCertificates = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 9;
		const startIndex = (page - 1) * limit;

		const userId = req.userId;

		const totalCertificates = await Certificate.countDocuments({
			student: userId,
		});
		const totalPages = Math.ceil(totalCertificates / limit);

		const certificates = await Certificate.find({ student: userId })
			.populate("course", "title")
			.sort({ date: -1 })
			.skip(startIndex)
			.limit(limit);

		res.json({
			certificates,
			currentPage: page,
			totalPages,
			totalCertificates,
		});
	} catch (error) {
		console.error("Error fetching certificates:", error);
		res
			.status(500)
			.json({ message: "Error fetching certificates", error: error.message });
	}
};

module.exports = {
	prepareCertificateData,
	verifyCertificate,
	getAllUserCertificates
};

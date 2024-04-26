
const dotenv = require("dotenv");
dotenv.config();

const allowedOrigins = [
	"http://localhost:5173",
	"http://localhost:5174",
	"http://localhost:3000",
	"http://localhost:3002",
	"http://localhost:3001",
	process.env.CLIENT_URL,
];

module.exports = allowedOrigins;

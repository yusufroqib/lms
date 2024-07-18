
const dotenv = require("dotenv");
dotenv.config();


const allowedOrigins = [
	process.env.CLIENT_URL,
	"http://localhost:5173",
	"http://localhost:5174",
	"http://localhost:3000",
	"http://localhost:3002",
	"http://localhost:3001",
];

module.exports = allowedOrigins;

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
// const passport = require("passport");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
// const initializePassport = require("./config/passport-setup");
const cookieParser = require("cookie-parser");



dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing

app.use(express.json({ limit: "50mb" })); //parse json data inside the req body
app.use(express.urlencoded({ extended: true })); // parse form data inside the req body
app.use(cors(corsOptions));
app.use(cookieParser());



mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`Server Is 🏃‍♂️ On PORT ${PORT}`));
	})
	.catch((err) => console.log(err));
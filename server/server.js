const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const credentials = require("./middleware/credentials");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const refreshRoute = require("./routes/refresh");
require("./config/passport-setup");

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Set up MongoDB store
const store = new MongoDBStore({
	uri: process.env.MONGO_URI,
	collection: "sessions",
	expires: 1 * 60 * 60, // 1hr in seconds
});


// Use express-session middleware
app.use(
	session({
		secret: process.env.SESSION_SECRET, // Change this to a secure secret key
		resave: false,
		saveUninitialized: false,
		store: store, // Use MongoDB store
	})
);


// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Middleware to initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: "50mb" })); //parse json data inside the req body
app.use(express.urlencoded({ extended: true })); // parse form data inside the req body

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/refresh", refreshRoute);

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`Server Is 🏃‍♂️ On PORT ${PORT}`));
	})
	.catch((err) => console.log(err));

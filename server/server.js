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
// const bodyParser = require('body-parser');
const authRoutes = require("./routes/authRoutes");
const refreshRoute = require("./routes/refresh");
const userRoutes = require("./routes/userRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const courseRoutes = require("./routes/courseRoutes");
const classroomRoutes = require("./routes/classroomRoutes");
const communityRoutes = require("./routes/communityRoutes");
const webhookRoute = require("./routes/webhookRoute");
const nonceRoutes = require("./routes/nonceRoutes");

const homeHTMLContent = require("./utils/homeHTMLContent");
const CoursePaymentController = require("./controllers/contractEventsController");
// const webhookRoute = require("./routes/webhookRoute");
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

// Stripe webhook parsing middleware
app.use((req, res, next) => {
	if (req.originalUrl === "/api/webhook") {
		next();
	} else {
		express.json()(req, res, next);
	}
});

// Use express.raw for the Stripe webhook route
app.use("/api", express.raw({ type: "application/json" }));

// Middleware to initialize passport
app.use(passport.initialize());
app.use(passport.session());
// app.use(express.json({ limit: "50mb" })); //parse json data inside the req body
app.use(express.urlencoded({ extended: true })); // parse form data inside the req body

// Cross Origin Resource Sharing
app.use(cors(corsOptions));
app.use(cookieParser());
// app.use(bodyParser.raw({ type: 'application/json' }));

app.get("/", (req, res) => {
	res.send(homeHTMLContent);
});
app.use("/nonce", nonceRoutes);
app.use("/auth", authRoutes);
app.use("/api", webhookRoute);
app.use("/refresh", refreshRoute);
app.use("/users", userRoutes);
app.use("/tutors", tutorRoutes);
app.use("/courses", courseRoutes);
app.use("/classrooms", classroomRoutes);
app.use("/community", communityRoutes);

CoursePaymentController.initializeWebSocket();


mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		app.listen(PORT, () => console.log(`Server Is 🏃‍♂️ On PORT ${PORT}`));
	})
	.catch((err) => console.log(err));

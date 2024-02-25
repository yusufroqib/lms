const {createTitle} = require("../controllers/courseController")
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();

router.post("/create-title", verifyJWT, createTitle);
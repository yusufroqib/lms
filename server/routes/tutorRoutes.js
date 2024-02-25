const { createTitle } = require("../controllers/courseController");
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const verifyRoles = require("../middleware/verifyRoles");
const { Admin, Tutor, Student } = require("../config/roles_list");

const router = express.Router();

router.post("/create-title", verifyJWT, verifyRoles(Admin, Tutor), createTitle);

module.exports = router;
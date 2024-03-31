
const express = require("express");
const verifyJWT = require("../middleware/verifyJWT");
const { getMyClassrooms } = require("../controllers/classroomController");


const router = express.Router();
router.get("/", verifyJWT, getMyClassrooms);


module.exports = router;

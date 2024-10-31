
const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");


const { verifyCertificate, getAllUserCertificates } = require("../controllers/certificateController");

router.get("/verify", verifyCertificate);
router.get("/my-certificates",verifyJWT, getAllUserCertificates);

module.exports = router;

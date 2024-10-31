
const express = require("express");
const router = express.Router();

const { verifyCertificate, getAllUserCertificates } = require("../controllers/certificateController");

router.get("/verify", verifyCertificate);
router.get("/my-certificates", getAllUserCertificates);

module.exports = router;

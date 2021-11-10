const express = require("express");
const router = express.Router();
const AuthHelper = require("../Helpers/AuthHelper");

const AuthCtrl = require("../controllers/auth");

router.post("/register", AuthCtrl.CreateUser);
router.post("/login", AuthCtrl.LoginUser);
router.get("/instructors", AuthHelper.VerifyToken, AuthCtrl.GetAllInstructors);

router.delete(
  "/instructor/delete-instructor/:id",
  AuthHelper.VerifyToken,
  AuthCtrl.deleteInstructor
);

module.exports = router;

const express = require("express");
const router = express.Router();

const TrainingCtrl = require("../controllers/training");
const AuthHelper = require("../Helpers/AuthHelper");

router.post(
  "/training/add-training",
  AuthHelper.VerifyToken,
  TrainingCtrl.AddTraining
);
router.put(
  "/training/add-training/:id",
  AuthHelper.VerifyToken,
  TrainingCtrl.updateTraining
);
router.delete(
  "/training/delete-training/:id",
  AuthHelper.VerifyToken,
  TrainingCtrl.deleteTraining
);

router.get("/trainingCourses", TrainingCtrl.GetTrainingCourses);
router.get("/trainingCourse/:id", TrainingCtrl.GetTrainingCourse);

module.exports = router;

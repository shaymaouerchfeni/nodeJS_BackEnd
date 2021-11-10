const express = require("express");
const router = express.Router();

const TrainingSessionCtrl = require("../controllers/trainingSession");
const AuthHelper = require("../Helpers/AuthHelper");

router.post(
  "/trainingSession/add-training-session",
  AuthHelper.VerifyToken,
  TrainingSessionCtrl.AddTrainingSession
);

router.get(
  "/trainingSessions",
  AuthHelper.VerifyToken,
  TrainingSessionCtrl.GetAllTrainingSessions
);

router.get(
  "/trainingSessions/instructor/:id",
  TrainingSessionCtrl.GetAllTrainingByInstructor
);

router.get(
  "/trainingSessions/student/:id",
  TrainingSessionCtrl.GetAllTrainingByStudent
);

router.get(
  "/trainingSessions/training/:id",
  TrainingSessionCtrl.GetAllTrainingSessionByTraining
);
router.post(
  "/trainingSessions/add-student/:id",
  TrainingSessionCtrl.addStudentToTraining
);

// router.get("/availableDates/certif/:id",AuthHelper.VerifyToken,TrainingSessionCtrl.chooseAvailableDates);

// router.put("/availableDates/confirm-student/:id",AuthHelper.VerifyToken,TrainingSessionCtrl.updateStudentStatus);

module.exports = router;

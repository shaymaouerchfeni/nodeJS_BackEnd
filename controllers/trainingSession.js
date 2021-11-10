const Joi = require("joi");
const HttpStatus = require("http-status-codes");
const TrainingSession = require("../models/trainingSession");
const Instructor = require("../models/userModels");
var mongoose = require("mongoose");

module.exports = {
  /***************************** ADD Training Session **************************************/
  async AddTrainingSession(req, res) {
    if (req.user.role !== "admin") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }
    console.log("req", req.body);
    const trainingSession = new TrainingSession({
      training: req.body.training,
      instructor: req.body.instructor,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      createdAt: new Date(),
    });

    await TrainingSession.create(trainingSession)
      .then(async (trainingSession) => {
        res
          .status(HttpStatus.OK)
          .json({ message: "training session created", trainingSession });
      })
      .catch((err) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" });
      });
  },

  /*************************************** GET ALL training sessions  ******************************************/
  async GetAllTrainingSessions(req, res) {
    // if(req.user.role !== 'admin'){
    //   return  res
    //  .status(HttpStatus.FORBIDDEN)
    //  .json({ message: "Forbidden" });

    // }
    try {
      const trainingSessions = await TrainingSession.find({}).sort({
        createdAt: -1,
      });

      return res
        .status(HttpStatus.OK)
        .json({ message: "All trainingSessions", trainingSessions });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },
  /******************************************************************************** */
  async GetAllTrainingByInstructor(req, res) {
    console.log("Instructors ID", req.params);

    try {
      const trainingByInstructor = await TrainingSession.find({
        instructor: { $elemMatch: { _id: req.params.id } },
      }).sort({ createdAt: -1 });
      console.log("trainingByInstructor", trainingByInstructor);

      return res.status(HttpStatus.OK).json({
        message: "All Training session by instructor",
        trainingByInstructor,
      });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },

  /******************************************************************************** */
  async GetAllTrainingByStudent(req, res) {
    console.log("Instructors ID", req.params);

    try {
      const trainingByStudent = await TrainingSession.find({
        students: { $elemMatch: { _id: req.params.id } },
      }).sort({ createdAt: -1 });
      console.log("trainingByStudent", trainingByStudent);

      return res.status(HttpStatus.OK).json({
        message: "All Training session by Student",
        trainingByStudent,
      });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },
  /***************************************************************** */
  async GetAllTrainingSessionByTraining(req, res) {
    console.log("training", req.params);

    try {
      const trainingSessionByTraining = await TrainingSession.find({
        "training._id": req.params.id,
      }).sort({ createdAt: -1 });
      console.log("trainingSessionByTraining", trainingSessionByTraining);

      return res.status(HttpStatus.OK).json({
        message: "trainingSessionByTraining",
        trainingSessionByTraining,
      });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },

  /********************************************************************************* */

  async addStudentToTraining(req, res) {
    console.log("user", req.body);
    if (req.body.role !== "student") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }
    console.log(req.body);
    console.log(req.params.id);
    try {
      await TrainingSession.findOneAndUpdate(
        { _id: req.params.id },
        {
          $addToSet: {
            students: [req.body],
          },
        },

        { upsert: true },
        (err, trainingSession) => {
          if (err) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: "Not Found" });
          }

          return res
            .status(HttpStatus.OK)
            .json({ message: "add student to training", trainingSession });
        }
      );
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },

  /************************************************************************************ */

  async updateStudentStatus(req, res) {
    if (req.user.role !== "supervisor") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }
    console.log(req.params.id);

    try {
      await Availabledate.findOneAndUpdate(
        { _id: req.params.id, "students._id": req.body._id },
        {
          $set: {
            "students.$.status": req.body.status,
          },
        },
        { multi: true },
        (err, availableDate) => {
          if (err) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: "Not Found" });
          }

          return res
            .status(HttpStatus.OK)
            .json({ message: "update status", availableDate });
        }
      );
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },
};

const Joi = require("joi");
const HttpStatus = require("http-status-codes");
const Training = require("../models/trainingModel");

module.exports = {
  /***************************** ADD Training Course **************************************/
  async AddTraining(req, res) {
    if (req.user.role !== "admin") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }
    console.log("ahmed", req.user);
    const schema = Joi.object().keys({
      title: Joi.string().required(),
      description: Joi.string(),
      numberHours: Joi.number(),
      program: Joi.string(),
      level: Joi.string(),
      tags: Joi.array(),
    });
    const { error } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(Httpstatus.BAD_REQUEST).json({
        msg: error.details,
      });
    }
    const training = new Training({
      title: req.body.title,
      description: req.body.description,
      numberHours: req.body.numberHours,
      program: req.body.program,
      level: req.body.level,
      tags: req.body.tags,
      createdAt: new Date(),
    });

    await Training.create(training)
      .then(async (training) => {
        res
          .status(HttpStatus.OK)
          .json({ message: "Training Course created", training });
      })
      .catch((err) => {
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error occured" });
      });
  },

  /*************************************** GET  Training Courses  ******************************************/
  async GetTrainingCourses(req, res) {
    try {
      const trainingCourses = await Training.find({}).sort({ createdAt: -1 });

      return res
        .status(HttpStatus.OK)
        .json({ message: "All Training", trainingCourses });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },

  /*********************************************find by id **************************************************** */
  async GetTrainingCourse(req, res) {
    try {
      const trainingCourse = await Training.findById({
        _id: req.params.id,
      });

      return res
        .status(HttpStatus.OK)
        .json({ message: " Training course", trainingCourse });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },

  /*************************************** update Training Course ******************************************/

  async updateTraining(req, res) {
    if (req.user.role !== "admin") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }
    console.log(req.params.id);
    console.log(req.body);

    try {
      await Training.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true },
        (err, training) => {
          if (err) {
            return res
              .status(HttpStatus.INTERNAL_SERVER_ERROR)
              .json({ message: "Not Found" });
          }

          return res
            .status(HttpStatus.OK)
            .json({ message: "update training", training });
        }
      );
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },

  /*************************************** delete Training Course ******************************************/

  async deleteTraining(req, res) {
    if (req.user.role !== "admin") {
      return res.status(HttpStatus.FORBIDDEN).json({ message: "Forbidden" });
    }
    console.log(req.params.id);

    try {
      await Training.remove({ _id: req.params.id }, (err, training) => {
        if (err) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Not Found" });
        }

        return res
          .status(HttpStatus.OK)
          .json({ message: "delete training", training });
      });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },
};

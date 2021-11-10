const Joi = require("joi");
const HttpStatus = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModels");
const Helpers = require("../Helpers/helpers");
const dbConfig = require("../config/secret");

module.exports = {
  /************************ create User  **************************/
  async CreateUser(req, res) {
    const schema = Joi.object().keys({
      username: Joi.string().min(5).max(10).required(),
      email: Joi.string().email().required(),
      role: Joi.string().required(),
      password: Joi.string().min(5).required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      phoneNumber: Joi.number(),
      cardNumber: Joi.number(),
      hourlyRate: Joi.number(),
      picture: Joi.string(),
      cv: Joi.string(),
      speciality: Joi.string(),
    });

    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        msg: error.details,
      });
    }

    const userEmail = await User.findOne({
      email: Helpers.lowerCase(req.body.email),
    });
    if (userEmail) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ message: "Email already exist" });
    }

    const userName = await User.findOne({
      username: Helpers.firstUpper(req.body.username),
    });
    // if (userName) {
    //   return res
    //     .status(HttpStatus.CONFLICT)
    //     .json({ message: "Username already exist" });
    // }

    return bcrypt.hash(value.password, 10, (err, hash) => {
      if (err) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ message: "Error hashing password" });
      }
      const body = {
        username: Helpers.firstUpper(value.username),
        email: Helpers.lowerCase(value.email),
        role: req.body.role,
        password: hash,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        cardNumber: req.body.cardNumber,
        hourlyRate: req.body.hourlyRate,
        picture: req.body.picture,
        cv: req.body.cv,
        speciality: req.body.speciality,
        createdAt: new Date(),
      };
      User.create(body)
        .then((user) => {
          const token = jwt.sign({ data: user }, dbConfig.secret, {});
          res.cookie("auth", token);
          res
            .status(HttpStatus.CREATED)
            .json({ message: "User created successfully", user, token });
        })
        .catch((err) => {
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Error occured" });
        });
    });
  },

  /****************************  login User  ******************************/
  async LoginUser(req, res) {
    if (!req.body.email || !req.body.password) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "No empty fields allowed" });
    }
    await User.findOne({
      email: Helpers.lowerCase(req.body.email),
    })
      .then((user) => {
        if (!user) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: "email not found " });
        }
        return bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
            if (!result) {
              return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: "Password is incorrect" });
            }
            const token = jwt.sign({ data: user }, dbConfig.secret, {});
            res.cookie("auth", token);
            return res
              .status(HttpStatus.OK)
              .json({ message: "Login successfuly", user, token });
          });
      })
      .catch((err) => {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Error  occured" });
      });
  },

  /******************************get Instructors ***************************/
  async GetAllInstructors(req, res) {
    // User.find({})
    // .then(Instructors => {

    //   res
    //     .status(Httppstatus.OK)
    //     .json({ message: "get Instructors", Instructors });
    // })
    // .catch(err => {
    //   res
    //     .status(Httppstatus.INTERNAL_SERVER_ERROR)
    //     .json({ message: "Error occured" });
    // });
    try {
      const instructors = await User.find({ role: "instructor" })
        .select("-password")
        .sort({ createdAt: -1 });
      return res
        .status(HttpStatus.OK)
        .json({ message: "All Instructors", instructors });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },

  /*************************************** delete instructor */
  async deleteInstructor(req, res) {
    console.log(req.params.id);

    try {
      await User.remove({ _id: req.params.id }, (err, instructor) => {
        if (err) {
          return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "Not Found" });
        }

        return res
          .status(HttpStatus.OK)
          .json({ message: "delete instructor", instructor });
      });
    } catch (err) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error occured" });
    }
  },
};

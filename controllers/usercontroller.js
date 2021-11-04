const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post("/create", async (req, res) => {
  let { username, password } = req.body.user;
  
  try {
   let aUser =  await User.create({
      username,
      password: bcrypt.hashSync(password, 13),
    });

let token = jwt.sign({ id: aUser.id }, "i_am_secret", {
    expiresIn: 60 * 60 * 24,
  });
  
    res.status(200).json({
      message: "This is the user",
      user: User,
      sessionToken: token,
    });
  } catch (err) {
    if (err instanceof UniqueConstraintError) {
      res.status(409).json({
        message: "Email already in use",
      });
    } else {
      res.status(500).json({
        message: "Complete Fail",
      });
    }
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body.user;

  try {
    const loginUser = await User.findOne({
      where: {
        username: username,
      },
    });

    if (loginUser) {
      let passwordComparison = await bcrypt.compare(
        password,
        loginUser.password
      );

      if (passwordComparison) {
        let token = jwt.sign(
          { username: username, password: password },
          "i_am_secret",
          { expiresIn: 60 * 60 * 24 }
        );
        res.status(200).json({
          user: loginUser,
          sessionToken: token,
          message: "User is in",
        });
      }
    } else {
      res.status(401).json({
        message: "FAILED",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to log in user",
    });
  }
});

module.exports = router;

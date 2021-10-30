const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
  let { username, password } = req.body.user;
  let token = jwt.sign(
    { id: User.id },
    "i_am_secret",
    { expiresIn: 60 * 60 * 24 }
  );

  await User.create({
    username,
    password: bcrypt.hashSync(password, 13),
  });

  res.status(200).json({
    message: "This is the user",
    user: User,
    sessionToken: token,
  });

  res.status(500).json({
    message: "THIS IS THE MESSAGE",
  });
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

      let passwordComparison = await bcrypt.compare(password, loginUser.password);

      if(passwordComparison){
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

const db = require("../models");
const bcrypt = require("bcrypt");

// create main Model
const User = db.users;

// main work

// 1. create product
const register = async (req, res) => {
  if (
    req.body.username == null ||
    req.body.password == null ||
    req.body.name == null
  ) {
    res
      .status(400)
      .json({
        Message: "Empty username or password or name param!",
      })
      .send();
  } else {
    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
      User.create({
        username: req.body.username,
        password: hash,
        name: req.body.name,
      })
        .then(function () {
          res
            .status(200)
            .json({
              Message: "User Created!",
            })
            .send();
        })
        .catch(function (err) {
          res
            .status(500)
            .json({
              Message: err.errors[0].message,
            })
            .send();
        });
    });
  }
};

// 2. get
const login = async (req, res) => {
  const { username, password } = req.body;
  if (username == null || password == null) {
    res
      .status(400)
      .json({
        Message: "Empty username or password param!",
      })
      .send();
  } else {
    User.findOne({
      where: { username: username },
    })
      .then(function (user) {
        if (!user) {
          res.status(400).json({
            Message: "Login not successful",
            error: "User not found",
          });
        } else {
          bcrypt.compare(password, user.password).then(function (result) {
            result
              ? res
                  .status(200)
                  .json({
                    Message: "Login Successful!",
                    data: user,
                  })
                  .send()
              : res.status(400).json({
                  Message: "Login not successful",
                  error: "Wrong password",
                });
          });
        }
      })
      .catch(function (err) {
        res
          .status(500)
          .json({
            Message: err.errors[0].message,
          })
          .send();
      });
  }
};

// 3. update
const update = async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) {
    res
      .status(400)
      .json({
        Message: "Empty username or password param!",
      })
      .send();
  } else {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      User.update(
        { password: hash, name: name },
        {
          where: { username: username },
        }
      )
        .then(function () {
          res
            .status(200)
            .json({
              Message: "User Updated!",
            })
            .send();
        })
        .catch(function (err) {
          res
            .status(500)
            .json({
              Message: err,
            })
            .send();
        });
    });
  }
};

module.exports = {
  register,
  login,
  update,
};

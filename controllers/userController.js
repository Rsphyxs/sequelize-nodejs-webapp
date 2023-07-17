require("dotenv").config();

const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Create Model
const User = db.users;
const Token = db.tokens;

// 1. Register User
const register = async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) {
    res
      .status(400)
      .json({
        Status: "Failed!",
        Message: "Empty username or password or name param!",
      })
      .send();
  } else {
    try {
      await db.sequelize.transaction(async (t) => {
        const saltRounds = 10;
        await bcrypt.hash(password, saltRounds).then(async function (hash) {
          await User.create(
            {
              username: username,
              password: hash,
              name: name,
            },
            { transaction: t }
          ).then(async function () {
            let accessToken = jwt.sign(
              { username: username },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "30s",
              }
            );
            let refreshToken = jwt.sign(
              { username: username },
              process.env.REFRESH_TOKEN_SECRET
            );
            await Token.create(
              {
                username: username,
                token: refreshToken,
              },
              { transaction: t }
            ).then(async function () {
              res
                .status(200)
                .json({
                  Status: "Successful!",
                  Message: "User created!",
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                })
                .send();
            });
          });
        });
      });
    } catch (err) {
      res
        .status(500)
        .json({
          Status: "Failed!",
          Message: "Can't create user!",
          error: err.name,
        })
        .send();
    }
  }
};

// 2. Login User
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res
      .status(400)
      .json({
        Status: "Failed!",
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
            Status: "Failed!",
            Message: "Login not successful",
            error: "User not found",
          });
        } else {
          bcrypt.compare(password, user.password).then(async function (result) {
            if (result) {
              let accessToken = jwt.sign(
                { username: username },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "30s",
                }
              );
              let refreshToken = jwt.sign(
                { username: username },
                process.env.REFRESH_TOKEN_SECRET
              );
              try {
                await db.sequelize.transaction(async (t) => {
                  await Token.create(
                    {
                      username: username,
                      token: refreshToken,
                    },
                    { transaction: t }
                  ).then(async function () {
                    res
                      .status(200)
                      .json({
                        Status: "Successful!",
                        Message: "Login Successful",
                        data: result,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                      })
                      .send();
                  });
                });
              } catch (err) {
                res
                  .status(500)
                  .json({
                    Status: "Failed!",
                    Message: "Login not successful",
                    error: err.name,
                  })
                  .send();
              }
            } else {
              res.status(400).json({
                Status: "Failed!",
                Message: "Login not successful",
                error: "Wrong password",
              });
            }
          });
        }
      })
      .catch(function (err) {
        res
          .status(500)
          .json({
            Message: err.name,
          })
          .send();
      });
  }
};

// 3. Update User Info
const update = async (req, res) => {
  const { username, password, name } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res
      .status(400)
      .json({
        Status: "Failed!",
        Message: "Failed update user info!",
        error: "Empty token!",
      })
      .send();
  } else if (!username || !password || !name) {
    res
      .status(400)
      .json({
        Status: "Failed!",
        Message: "Failed update user info!",
        error: "Empty username or password or name!",
      })
      .send();
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res
          .status(401)
          .json({
            Status: "Failed!",
            Message: "Token unauthorized!",
            token: token,
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
                  Status: "Failed!",
                  Message: "User Updated!",
                })
                .send();
            })
            .catch(function (err) {
              res
                .status(500)
                .json({
                  Message: err.name,
                })
                .send();
            });
        });
      }
    });
  }
};

//Logout User
const logout = async (req, res) => {
  const { username } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res
      .status(400)
      .json({
        Status: "Failed!",
        Message: "Empty token!",
        token: token,
      })
      .send();
  } else if (!username) {
    res
      .status(400)
      .json({
        Status: "Failed!",
        Message: "Empty username param!",
      })
      .send();
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        res
          .status(401)
          .json({
            Status: "Failed!",
            Message: "Token unauthorized!",
            token: token,
          })
          .send();
      } else {
        Token.destroy({ where: { username: username } })
          .then(function () {
            res
              .status(200)
              .json({
                Status: "Successful!",
                Message: "Successfuly Logout!",
              })
              .send();
          })
          .catch(function (err) {
            res
              .status(500)
              .json({
                Message: err.name,
              })
              .send();
          });
      }
    });
  }
};

//Reauthenticate Token
const token = async (req, res) => {
  const { username, token } = req.body;
  if (!token) {
    res
      .status(401)
      .json({
        Status: "Failed!",
        Message: "Empty token!",
        token: token,
      })
      .send();
  } else if (!username) {
    res
      .status(400)
      .json({
        Status: "Failed!",
        Message: "Empty username param!",
      })
      .send();
  } else {
    Token.findOne({ where: { username: username, token: token } }).then(
      function (user) {
        if (!user) {
          res.status(400).json({
            Status: "Failed!",
            Message: "Refresh token not successful!",
            error: "Refresh token not found",
          });
        } else {
          jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
              res
                .status(403)
                .json({
                  Status: "Failed!",
                  Message: "Token unauthorized!",
                })
                .send();
            } else {
              newToken = jwt.sign(
                { username: username },
                process.env.ACCESS_TOKEN_SECRET
              );
              res
                .status(200)
                .json({
                  Status: "Successful!",
                  Message: "Token successfuly generated!",
                  username: username,
                  accessToken: newToken,
                })
                .send();
            }
          });
        }
      }
    );
  }
};

module.exports = {
  register,
  login,
  update,
  logout,
  token,
};

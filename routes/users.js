var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");
var passport = require("passport");
var authenticate = require("../authenticate");
router.use(bodyParser.json());
const User = require("../models/users");
var jwt = require("jsonwebtoken");

//AdminApi
//Get all users info
router.get("/allUser", authenticate.verifyUser,authenticate.checkAdmin, (req, res, next) => {
  User.find({}).then((resp)=>{
    res.statusCode = 200;
    res.json(resp);
  })
  .catch((err)=>{
    next(err);
  })  
});

//Get info of a logged in user
router.get("/", authenticate.verifyUser, (req, res, next) => {
  console.log(req.user);
  res.statusCode = 200;
  res.json(req.user);
});

//Login a new user
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: false, status: "Login Unsuccessful!", err: info });
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success: false,
          status: "Login Unsuccessful!",
          err: "Could not log in user!",
        });
      }

      var token = authenticate.getToken({ _id: req.user._id });
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json({ success: true, status: "Login Successful!", token: token });
    });
  })(req, res, next);
});
//Change User Info
router.post("/changeInfo",authenticate.verifyUser,(req,res,next)=>{
  console.log(req.body);
  console.log(req.user);
  User.findById(req.user._id).then(
    (user)=>{
      if(req.body.firstname){
        user.firstName=req.body.firstname;
      }
      if(req.body.lastname){
        user.lastName=req.body.lastname;
      }
      if(req.body.email){
        user.email=req.body.email;
      }
      user.save().then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({resp});
      })
      .catch(err=>{
        next(err);
      })
    }
  ).catch((err)=>{
    next(err);
  })
})
//SignUp a new user
router.post("/signup", (req, res, next) => {
  console.log(req.body);
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
      firstName: req.body.firstname,
      lastName: req.body.lastname,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err, req.body);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

//Check validity of a logged in user
router.post("/checktoken", (req, res, next) => {
  let token = req.body.token.toString();
  jwt.verify(token, config.secretKey, (err, decoded) => {
    if (err) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    } else {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end("Token Valid");
    }
  });
});
module.exports = router;

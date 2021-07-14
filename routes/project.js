//Perform CRUD on projects
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var authenticate = require("../authenticate");
router.use(bodyParser.json());
var User = require("../models/users");
var Project = require("../models/project");

//Admin Code
//Get projects of a user
router.get("/admin/usersProject/:user_id",authenticate.verifyUser,authenticate.checkAdmin,(req,res,next)=>{
    let user_id=req.params.user_id.toString();
    Project.find({owner:user_id}).populate('owner').then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=>{
        next(err);
    })
});
//Get All Projects
router.get("/admin/allProjects",authenticate.verifyUser,authenticate.checkAdmin,(req,res,next)=>{
 
  Project.find({}).populate('owner').then((resp)=>{
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(resp);
  })
  .catch((err)=>{
      next(err);
  })
});
//Create a new IOT project for a user
router.post("/createProject/:userId", authenticate.verifyUser,authenticate.checkAdmin, (req, res, next) => {
    Project.create({
      owner: req.params.userId,
      stage: req.body.stage,
      project_name: req.body.project_name,
      description: req.body.description,
    })
      .then((resp) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
      })
      .catch((err) => {
        next(err);
      });
  });
  
  //Change the stage at which a project is
  router.put(
    "/changeStage/:projectId",
    authenticate.verifyUser,
    authenticate.checkAdmin,
    (req, res, next) => {
      let projectId = req.params.projectId.toString();
      let newStage = req.body.stage;
      Project.findById(projectId)
        .then((project) => {
          if(project.owner.toString()==req.user._id.toString()){
              project.stage = newStage;
              project
                .save()
                .then((resp) => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(resp);
                })
                .catch((err) => {
                  next(err);
                });
          }
          else{
              let err=new Error('You are not owner of this table');
              next(err);
          }
        })
        .catch((err) => {
          next(err);
        });
    }
  );
  //Delete a project
  router.delete(
    "/deleteProject/:projectId",
    authenticate.verifyUser,
    authenticate.checkAdmin,
    (req, res, next) => {
      let projectId = req.params.projectId.toString();
      let newStage = req.body.stage;
      Project.delete(projectId)
        .then((project) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        })
        .catch((err) => {
          next(err);
        });
    }
  );
//Normal User Code
//Get logged  users project info
router.get("/usersProject/",authenticate.verifyUser,(req,res,next)=>{
    let user_id=req.user._id.toString();
    console.log(user_id);
    Project.find({owner:user_id}).then((resp)=>{
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(resp);
    })
    .catch((err)=>{
        next(err);
    })
});

module.exports = router;

var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var User = require("../models/user");


//POST A NEW User

router.post('/user', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      const newUser = new User(req.body)
  
      User.findOne({},{},{sort:{'userID':-1}},function(err,sucess){
  
        try{
            userID = sucess.userID + 1
        }
        catch{
            userID = 1
        }
        newUser.userID = userID
       
        newUser.save(function(err) {
        if (err) {
          return res.send({success: false, msg: err});
        }
        res.send(newUser);
      });
    } 
      )}
  else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });
  
   //GET ALL Users

router.get('/user', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
      User.find(function (err, users) {
        if (err) return next(err);
        res.json(users);
      })
      
    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });


    //Get events of given user
  
    router.get('/user/:userID',  passport.authenticate('jwt', { session: false}), (req, res)=> {
      var token = getToken(req.headers);
      if (token){
      const id = req.params.userID
      try{
       User.findOne({userID:id})
       .populate('events')
       .exec(function (err, user) {
         if (err) return handleError(err);
       
     if(!user)
     res.send('No data')
     res.send(user.events)
     })
    }
      catch
      {
        ((error) => res.send(error.message))
      }
     
    }
  })
  
  //Edit existing user 
  
  router.patch('/user/:id',passport.authenticate('jwt', { session: false}), async(req, res)=> {
    var token = getToken(req.headers);
    if (token) {
  
    try{
        const user =  await User.findOneAndUpdate(
          {userID:req.params.id},req.body,{new:true , runValidators:true})
          .populate('events')
          .exec(function (err, user) {
            if (err) return handleError(err);
          
        if(!user)
        res.send('No data')
        res.send(user)
        })
  
  }
    catch(e){
        res.send(e.message)
    } 
  
    }
  })
  

  
  getToken = function (headers) {
    if (headers && headers.authorization) {
      var parted = headers.authorization.split(' ');
      if (parted.length === 2) {
        return parted[1];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  
  module.exports = router;
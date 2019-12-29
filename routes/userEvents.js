var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var User = require("../models/user");
var Event = require("../models/event");



    //Get events of given user
  
    router.get('/userevents/:userID',  passport.authenticate('jwt', { session: false}), (req, res)=> {
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


  //Get UPcoming Events
router.get('/upcomingevents',passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
    var currentdate = new Date();
    Event.find({date: {$gte: currentdate}}, function (err, event) {
        try{
            if(!event)
            res.send('Can\'t get data')
           res.send(event)  
        }
        catch{
            res.send(err)
        } 
       
    })
  }
  });

  //Get Past Events
  router.get('/pastevents',passport.authenticate('jwt' ,{session:false}),function(req,res){
      var token = getToken(req.headers)
      if(token){
          var currentdate = new Date();
          Event.find({date:{$kte:currentdate}},function(err,event){
              try{
                  if(!event)
                  res.send('can\'t get data')
                  res.send(event)
              }
              catch{res.send(err)}
          })
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
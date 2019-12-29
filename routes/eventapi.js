var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var Event = require("../models/event");


//POST A NEW EVENT

router.post('/event', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    const newEvent = new Event(req.body)

    Event.findOne({},{},{sort:{'eventID':-1}},function(err,sucess){

      try{
          eventID = sucess.eventID + 1
      }
      catch{
          eventID = 1
      }
  newEvent.eventID = eventID
  
    newEvent.save(function(err) {
      if (err) {
        return res.send({success: false, msg: err});
      }
      res.send(newEvent);
    });
  } 
    )}
else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


//GET ALL EVENTS

router.get('/event', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Event.find(function (err, events) {
      if (err) return next(err);
      res.json(events);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

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

router.get('/pastevents',passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
  var currentdate = new Date();
  Event.find({date: {$lte: currentdate}}, function (err, event) {
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
})

//Edit Existing event
router.patch('/event/:id',passport.authenticate('jwt', { session: false}), async(req, res)=> {
  var token = getToken(req.headers);
  if (token) {

  try{
      const event =  await Event.findOneAndUpdate(
        {eventID:req.params.id},req.body,{new:true , runValidators:true})
        
      if(!event)
      res.send('No data')
      res.send(event)
      }

  catch(e){
      res.send(e.message)
  } 

  }
})


//Edit existing event in order to add user --> (Adding user to event)

router.patch('/userevent/:id',passport.authenticate('jwt', { session: false}), async(req, res)=> {
  var token = getToken(req.headers);
  if (token) {

  try{
      const event =  await Event.findOneAndUpdate(
        {eventID:req.params.id},req.body,{new:true , runValidators:true})
        .populate('users')
        .exec(function (err, event) {
          if (err) return handleError(err);
        
      if(!event)
      res.send('No data')
      res.send(event)
      })

}
  catch(e){
      res.send(e.message)
  } 

  }
})


    //Get users of given events
  
    router.get('/userevents/:eventID',  passport.authenticate('jwt', { session: false}), (req, res)=> {
      var token = getToken(req.headers);
      if (token){
      const id = req.params.userID
      try{
        Event.findOne({userID:id})
        .populate('users')
        .exec(function (err, event) {
          if (err) return handleError(err);
        
      if(!event)
      res.send('No data')
      res.send(event.users)
      })
     }
       catch
       {
         ((error) => res.send(error.message))
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

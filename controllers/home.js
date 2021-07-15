const Adventure = require('../models/adventure');
const Cities = require('../models/cities');
const User = require('../models/user');

const { validationResult } = require('express-validator/check');

exports.getAdventures = (req, res, next) => {
  Adventure.find()
    .then(adventures => {
      console.log(adventures);
      res.render('home/adventure-list', {
        advens: adventures,
        pageTitle: 'All Adventures',
        path: '/adventures'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.like = (req, res, next) => {
  const advenId = req.body.adventureId;
  const userId = req.user._id;
  Adventure.findById(advenId)
    .then(adventure => {
      for (like in adventure.likes.items){
        if(userId == userId){
          return res.redirect('/adventures/' + advenId);
        }
      }
      thisUser = {
        userId: req.user._id
      }
      adventure.likes.items.push(thisUser)
      adventure.save();
      
    })
    .then(result => {
      res.redirect('/adventures/' + advenId);
    })
    .catch(err => console.log(err));
};

exports.getCityAdventures = (req, res, next) => {
  const errors = validationResult(req);
  Adventure.find({ city: req.body.city, state: req.body.state })
    .then(adventures => {
      if (errors.isEmpty()) {
        return res.status(422).render('home/cityList', {
          adventures: adventures,
          pageTitle: 'All Adventures in ' + req.body.city,
          path: '/CityAdventures',
          oldInput: { city: req.body.city, state: req.body.state },
          validationErrors: []
        });
      } else {
        Cities.find()
          .then(cities => {
            return res.render('home/searchCity', {
              cities: cities,
              pageTitle: "Search for your city",
              path: '/searchCity',
              oldInput: { city: req.body.city, state: req.body.state },
              errorMessage: req.flash('error'),
              errorMessage: errors.array()[0].msg,
              validationErrors: errors.array()
            })

          })

      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.searchCityAdventures = (req, res, next) => {
  Cities.find()
    .then(cities => {
      res.render('home/searchCity', {
        cities: cities,
        pageTitle: "Search for your city",
        path: '/CityAdventures',
        oldInput: { city: "", state: "" },
        errorMessage: req.flash('error'),
        validationErrors: []
      })
    })
};

exports.getAdventure = (req, res, next) => {
  const errors = validationResult(req);
  const advenId = req.params.adventureId;
  Adventure.findById(advenId)
    .then(adventure => {
      if(adventure == null){
        console.log("it was null")
        res.status(404).render('404', { 
          pageTitle: 'Page Not Found', 
          path: '/404',
          deleted: true,
          isAuthenticated: req.session.isLoggedIn }
        );
        console.log("after")
      }
      res.render('home/adventure-detail', {
        adventure: adventure,
        pageTitle: adventure.title,
        reviews: adventure.reviews.items,
        path: '/adventures',
        editing: true,
        errorMessage: req.flash('error'),
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

exports.getProfile = (req, res, next) => {
  var userId;
  if(req.params.userId == 'you'){
    userId = req.user._id;
  }
  else{
    userId = req.params.userId;
  }
  var userAdventures = []
  Adventure.find({userId: userId})
  .then(adventure =>{
    userAdventures = adventure;
  })
  .then(result => {
    User.findById(userId)
    .then(user => {
      res.render('home/userProfile', {
        pageTitle: user.name,
        path: '/userProfile',
        adventures: userAdventures,
        name: user.name,
        city: user.city,
        bio: user.bio,
        ToDo: user.ToDo.items,
        CompleteAdventures: user.CompleteAdventures.items,
        imageUrl: user.imageUrl

      });
    })
    .catch(err => console.log(err));
  })
  //console.log(userAdventures);
  
};

exports.getIndex = (req, res, next) => {
  var profile;
  if(!req.user){
    userId = profile;
  }
  else{
    userId = req.user._id
  }
  Adventure.find()
    .then(adventures => {
      res.render('home/index', {
        advens: adventures,
        pageTitle: 'Home',
        userId: userId,
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getToDo = (req, res, next) => {
  req.user
    .populate('ToDo.items')
    .execPopulate()
    .then(user => {
      const adventures = user.ToDo.items;
      res.render('home/ToDo', {
        path: '/ToDo',
        pageTitle: 'Your To-Do List',
        adventures: adventures
      });
    })
    .catch(err => console.log(err));
};

exports.postToDo = (req, res, next) => {
  const advenId = req.body.adventureId;
  Adventure.findById(advenId)
    .then(adventure => {
      if(adventure == null){
        res.status(404).render('404', { 
          pageTitle: 'Page Not Found', 
          path: '/404',
          deleted: true,
          isAuthenticated: req.session.isLoggedIn })
        }
      console.log(adventure.title);
      return req.user.addToToDo(adventure);
    })
    .then(result => {
      console.log(result);
      res.redirect('/ToDo');
    });
};

exports.ToDoDeleteAdventure = (req, res, next) => {
  const ToDoId = req.body.adventureId;
  req.user
    .removeFromToDo(ToDoId)
    .then(result => {
      res.redirect('/ToDo');
    })
    .catch(err => console.log(err));
};

exports.getCompleteAdventures = (req, res, next) => {
  req.user
    .populate('CompleteAdventures.items')
    .execPopulate()
    .then(user => {
      const adventures = user.CompleteAdventures.items;
      res.render('home/CompleteAdventures', {
        path: '/CompleteAdventures',
        pageTitle: 'Your Completed Adventures',
        adventures: adventures
      });
    })
    .catch(err => console.log(err));
};

exports.postCompleteAdventures = (req, res, next) => {
  const ToDoId = req.body.adventureId;
  const advenId = req.body.adventureId;
  Adventure.findById(advenId)
    .then(adventure => {
      if(adventure == null){
        res.status(404).render('404', { 
          pageTitle: 'Page Not Found', 
          path: '/404',
          deleted: true,
          isAuthenticated: req.session.isLoggedIn })
        }
     // console.log(adventure.title);
      return req.user.addToCompleteAdventures(adventure);
    })
    .then(result => {
      req.user
        .removeFromToDo(ToDoId)
        .then(result => {
          console.log(result);
          res.redirect('/CompleteAdventures');
        })
        .catch(err => console.log(err));
    });
};

exports.CompleteAdventuresDeleteAdventure = (req, res, next) => {
  const advenId = req.body.adventureId;
  req.user
    .removeFromCompleteAdventures(advenId)
    .then(result => {
      res.redirect('/CompleteAdventures');
    })
    .catch(err => console.log(err));
};
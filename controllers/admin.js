const Adventure = require('../models/adventure');
const Cities = require('../models/cities');
const User = require('../models/user');

const { validationResult } = require('express-validator/check');

exports.getAddAdventure = (req, res, next) => {
  console.log("getAddAdventure called");
  res.render('admin/edit-adventure', {
    pageTitle: 'Add Adventure',
    path: '/admin/add-adventure',
    editing: false,
    hasError: false,
    errorMessage: req.flash('error'),
    validationErrors: []
  });
};

exports.postAddAdventure = (req, res, next) => {
  console.log("postAddAdventure called");
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const city = req.body.city;
  const state = req.body.state;
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-adventure', {
      pageTitle: 'Add Adventure',
      path: '/admin/edit-adventure',
      editing: false,
      hasError: true,
      adventure: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        city: city.toUpperCase(),
        state: state.toUpperCase()
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });

  }

  Cities.find({city: city.toUpperCase(), state: state.toUpperCase()})
  .then(cities =>{
    console.log(cities.length)
    if(cities.length == 0){
      const newCities = new Cities({
        city: req.body.city.toUpperCase(),
        state: req.body.state.toUpperCase()
      });
      newCities.save();
    }
  })

  var username
  if(req.user.name){
    username = req.user.name
  }
  else{
    username = req.user._id
  }

  const adventure = new Adventure({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    city: city.toUpperCase(),
    state: state.toUpperCase(),
    userId: req.user,
    userName: username,
    
  });
  adventure
    .save()
    .then(result => {
      // console.log(result);
      console.log('Created Adventure');
      res.redirect('/admin/adventures');
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getEditAdventure = (req, res, next) => {
  console.log("getEditAdventure called");
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const advenId = req.params.adventureId;
  Adventure.findById(advenId)
    .then(adventure => {
      if (!adventure) {
        return res.redirect('/');
      }
      res.render('admin/edit-adventure', {
        pageTitle: 'Edit Adventure',
        path: '/admin/edit-adventure',
        editing: editMode,
        hasError: false,
        adventure: adventure,
        errorMessage: req.flash('error'),
        validationErrors: []
      });
    })
    .catch(err => console.log(err));
};

exports.postEditAdventure = (req, res, next) => {
  console.log("postEditAdventure called");
  const advenId = req.body.adventureId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedCity = req.body.city;
  const updatedState = req.body.state

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-adventure', {
      pageTitle: 'Edit Adventure',
      path: '/admin/edit-adventure',
      editing: true,
      hasError: true,
      adventure: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        city: updatedCity,
        state: updatedState,
        _id: advenId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });

  }

  Adventure.findById(advenId)
    .then(adventure => {
      if(adventure.userId.toString() !== req.user._id.toString()){
        res.redirect('/');
      }
      adventure.title = updatedTitle;
      adventure.price = updatedPrice;
      adventure.description = updatedDesc;
      adventure.imageUrl = updatedImageUrl;
      adventure.city = updatedCity;
      adventure.state = updatedState;
      return adventure.save()
      .then(result => {
        console.log('UPDATED ADVENTURE!');
        res.redirect('/admin/adventures');
      });
    })
    
    .catch(err => console.log(err));
};




exports.postReview = (req, res, next) => {
    const review = req.body.review;
    const reviewUserName = req.user.name;
    const reviewUserId = req.user._id;
    const adventure = req.body.adventure;
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const price = req.body.price
    const description = req.body.description
    const city = req.body.city
    const state = req.body.state
    const _id = req.body._id
    userReview = {
    review: review,
    reviewUserName: reviewUserName,
    reviewUserId: reviewUserId
  }
  
  console.log("postReview called");
  const errors = validationResult(req);

  Adventure.findById(_id)
    .then(thisAdventure => {
      if(!errors.isEmpty()){
        return res.status(422).render('home/adventure-detail', {
          pageTitle: req.body.title,
          path: '/admin/post-review',
          reviews: thisAdventure.reviews.items,
          adventure: {
            title: title,
            imageUrl: imageUrl,
            price: price,
            description: description,
            city: city,
            state: state,
            _id: _id,
            reviews: thisAdventure.reviews.items,
            likes: thisAdventure.likes,
            review: req.body.review
          },
          editing: true,
          hasError: true,
          errorMessage: errors.array()[0].msg,
          validationErrors: errors.array()
        });
      }
      
      thisAdventure.reviews.items.push(userReview)
      return thisAdventure.save()
      .then(result => {
        console.log('UPDATED ADVENTURE!');
        res.redirect('/adventures/' + _id);
      });
    })
    
    .catch(err => console.log(err));
};

exports.getAdventures = (req, res, next) => {
  Adventure.find({userId: req.user._id})
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(adventure => {
      console.log(adventure);
      res.render('admin/adventures', {
        advens: adventure,
        pageTitle: 'Admin Adventures',
        path: '/admin/adventures'
      });
    })
    .catch(err => console.log(err));
};

// exports.getAddProfile = (req, res, next) => {
//   console.log("getAddProfile called");
//   var hasProfile = false;
//   editing = hasProfile;
//   res.render('admin/update-profile', {
//     pageTitle: 'Add Profile',
//     path: '/admin/add-profile',
//     editing: false,
//     hasError: false,
//     errorMessage: req.flash('error'),
//     validationErrors: []
//   });
// };

// exports.postAddProfile = (req, res, next) => {
//   console.log("postAddProfile called");
//   const name = req.body.name;
//   const imageUrl = req.body.imageUrl;
//   const city = req.body.city;
//   const bio = req.body.bio;
//   const errors = validationResult(req);

//   if(!errors.isEmpty()){
//     return res.status(422).render('admin/update-profile', {
//       pageTitle: 'Add Profile',
//       path: '/admin/update-profile',
//       editing: false,
//       hasError: true,
//       profile: {
//         name: name,
//         imageUrl: imageUrl,
//         bio: bio,
//         city: city
//       },
//       errorMessage: errors.array()[0].msg,
//       validationErrors: errors.array()
//     });
//   }

//   const profile = new Profile({
//     name: name,
//     bio: bio,
//     city: city,
//     imageUrl: imageUrl,
//     userId: req.user
//   });
//   profile
//     .save()
//     .then(result => {
//       // console.log(result);
//       console.log('Created Profile');
//       res.redirect('../');
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.getProfile = (req, res, next) => {
//   console.log("getProfile called");
//   User.find({_id: req.user._id})
//     // .select('title price -_id')
//     // .populate('userId', 'name')
//     .then(users => {
//       res.render('admin/profile', {
//         profs: users,
//         pageTitle: 'Your Profile',
//         path: '/admin/profile'
//       });
//     })
//     .catch(err => console.log(err));
// };

exports.getUpdateProfile = (req, res, next) => {
  console.log("getUpdateProfile called");
  // const editMode = req.query.edit;
  // if (!editMode) {
  //    return res.redirect('/');
  // }
  
    
    city = req.user.city
    
    myName = req.user.name
    
    bio = req.user.bio
    
    imageUrl = req.user.imageUrl
      res.render('admin/update-profile', {
        pageTitle: 'Update Profile',
        path: '/admin/update-profile',
        // editing: editMode,
        hasError: false,
        profileId: req.user._id,
        city: city,
        name: myName,
        bio: bio,
        imageUrl: imageUrl,
        errorMessage: req.flash('error'),
        validationErrors: []
      })
};

exports.postUpdateProfile = (req, res, next) => {
  console.log("postUpdateProfile called");
  const profileId = req.body.profileId;
  const updatedName = req.body.name;
  const updatedBio = req.body.bio;
  const updatedImageUrl = req.body.imageUrl;
  const updatedCity = req.body.city;

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors.array()[0].msg);
    return res.status(422).render('admin/update-profile', {
      pageTitle: 'Update Profile',
      path: '/admin/update-profile',
      //editing: true,
      hasError: true,
      name: updatedName,
      imageUrl: updatedImageUrl,
      bio: updatedBio,
      city: updatedCity,
      profileId: req.user._id,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });

  }

  User.findOne(req.user._id)
    .then(user => {
      if(!req.user._id.toString()){
        res.redirect('/');
      }
      user.name = updatedName;
      user.bio = updatedBio;
      user.city = updatedCity;
      user.imageUrl = updatedImageUrl;
      return user.save()
      .then(result => {
        console.log('UPDATED PROFILE!');
        res.redirect('/profiles/you');
      });
    })
    
    .catch(err => console.log(err));
};

exports.postDeleteAdventure = (req, res, next) => {
  console.log("postDeleteAdventure called");
  const advenId = req.body.adventureId;
  
  Adventure.deleteOne({_id: advenId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED ADVENTURE');
      res.redirect('/admin/adventures');
    })
    .catch(err => console.log(err));
};

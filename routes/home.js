const path = require('path');

const express = require('express');
const { check, body } = require('express-validator/check');

const homeController = require('../controllers/home');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', homeController.getIndex);

router.get('/adventures', homeController.getAdventures);

router.get('/profiles/:userId', homeController.getProfile);

// router.post('/update-profile', [
//     body('name', 'Name has to be at least 3 characters').isLength({min: 3}).isString().trim(),
//     body('imageUrl', 'Must be a valid URL').isURL(),
//     body('city', 'Must be at least 2 characters').isLength({min: 2}).isString().trim(),
//     body('bio', 'Description must be between 5 and 400 characters').isLength({min: 5, max:400}).trim(),
// ], isAuth, homeController.postUpdateProfile);

router.get('/adventures/:adventureId', homeController.getAdventure);

router.get('/ToDo', isAuth, homeController.getToDo);

router.post('/ToDo', isAuth, homeController.postToDo);

router.post('/ToDoDeleteAdventure', isAuth, homeController.ToDoDeleteAdventure);

router.get('/CompleteAdventures', isAuth, homeController.getCompleteAdventures);

router.post('/CompleteAdventures', isAuth, homeController.postCompleteAdventures);

router.post('/like', isAuth, homeController.like);

router.get('/CityAdventures', isAuth, homeController.searchCityAdventures);

router.post('/CityAdventures', [
    body('city', 'City name has to be at least 3 characters').isLength({min: 3}).isString().trim(),
    body('state', 'State must be only 2 characters').isLength(2).isString().trim(),
], isAuth, homeController.getCityAdventures);

router.post('/CompleteAdventuresDeleteAdventure', isAuth, homeController.CompleteAdventuresDeleteAdventure);

// router.post('/create-order', isAuth, homeController.postOrder);

// router.get('/orders', isAuth, homeController.getOrders);

module.exports = router;

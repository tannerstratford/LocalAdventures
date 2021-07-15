const path = require('path');

const express = require('express');
const { check, body } = require('express-validator/check');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-adventure => GET
router.get('/add-adventure', isAuth, adminController.getAddAdventure);

// /admin/adventures => GET
router.get('/adventures', isAuth, adminController.getAdventures);

// router.get('/profile', isAuth, adminController.getProfile);

// /admin/adventures => GET
//router.get('/add-profile', isAuth, adminController.getAddProfile);

router.get('/update-profile', isAuth, adminController.getUpdateProfile);

router.post('/update-profile', [
    body('name', 'Name has to be at least 3 characters').isLength({min: 3}).isString().trim(),
    body('imageUrl', 'Must be a valid URL').isURL(),
    body('city', 'Must be at least 2 characters').isLength({min: 2}).isString().trim(),
    body('bio', 'Description must be between 5 and 400 characters').isLength({min: 5, max:400}).trim(),
], isAuth, adminController.postUpdateProfile);

// router.post('/add-profile', [
//     body('name', 'Name has to be at least 3 characters').isLength({min: 3}).isString().trim(),
//     body('imageUrl', 'Must be a valid URL').isURL(),
//     body('city', 'Must be at least 2 characters').isLength({min: 2}).isString().trim(),
//     body('bio', 'Description must be between 5 and 400 characters').isLength({min: 5, max:400}).trim(),
// ], isAuth, adminController.postAddProfile);

// /admin/add-adventure => POST
router.post('/add-adventure', [
    body('title', 'Title has to be at least 3 characters').isLength({min: 3}).isString().trim(),
    body('imageUrl', 'Must be a valid URL').isURL(),
    body('city', 'City must be at least 3 characters').isLength({min: 3}).isString().trim(),
    body('state', 'State must be 2 characters').isLength(2).isString().trim(),
    body('price', 'Must be decimal point number (Do not add $)').isFloat(),
    body('description', 'Description must be between 5 and 400 characters').isLength({min: 5, max:400}).trim(),
], isAuth, adminController.postAddAdventure);


router.get('/edit-adventure/:adventureId', isAuth, adminController.getEditAdventure);

router.post('/post-review', [
    body('review', 'Review must be between 15 and 400 characters').isLength({min: 15, max:400}).isString()
], isAuth, adminController.postReview);

router.post('/edit-adventure', [
    body('title', 'Title has to be at least 3 characters').isLength({min: 3}).isString().trim(),
    body('imageUrl', 'Must be a valid URL').isURL(),
    body('price', 'Must be decimal point number (Do not add $)').isFloat(),
    body('description', 'Description must be between 5 and 400 characters').isLength({min: 5, max:400}).trim(),
], isAuth, adminController.postEditAdventure);

router.post('/delete-adventure', isAuth, adminController.postDeleteAdventure);

module.exports = router;

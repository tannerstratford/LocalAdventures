const path = require('path');

const express = require('express');
const { check, body } = require('express-validator/check');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body('title', 'Title has to be at least 3 characters').isLength({min: 3}).isString().trim(),
    body('imageUrl', 'Must be a valid URL').isURL(),
    body('price', 'Must be decimal point number (Do not add $)').isFloat(),
    body('description', 'Description must be between 5 and 400 characters').isLength({min: 5, max:400}).trim(),
], isAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product', [
    body('title', 'Title has to be at least 3 characters').isLength({min: 3}).isString().trim(),
    body('imageUrl', 'Must be a valid URL').isURL(),
    body('price', 'Must be decimal point number (Do not add $)').isFloat(),
    body('description', 'Description must be between 5 and 400 characters').isLength({min: 5, max:400}).trim(),
], isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;

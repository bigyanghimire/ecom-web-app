const queries = require('./db/queries');
const express = require('express');
const fs = require("fs");
const path = require('path');
const knex = require('./db/knex');
const router = express.Router();

var aws = require('aws-sdk');// ^2.2.41

var multer = require('multer'); // "multer": "^1.1.0"
var multerS3 = require('multer-s3'); //"^1.4.1"
// invoke an instance of express application.

var s3 = new aws.S3();
//upload settiungs for multer
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'vidr-storage',
        ACL: 'public-read',
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.originalname);
        }
    })
});
const s3Client = new aws.S3({
    accessKeyId: 'AKIAYKHRBGCJI34QWOST',
    secretAccessKey: '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',
    region: 'us-east-2'
});
const uploadParams = {

    Key: '', // pass key
    Body: null, // pass file body
};


//post product

router.post('/product', (req, res) => {

    queries
        .product
        .create(req.body)
        .then(product => {

            res.json(product)

        });

    /*
        knex('users').insert(req.body).then(function (ret) {
            res.json({ success: true, message:  });
        });*/


});
//
router.post('/update/:id', (req, res) => {

    queries
        .product
        .update(req.params.id, req.body)
        .then(product => {

            res.json(product)

        });

    /*
        knex('users').insert(req.body).then(function (ret) {
            res.json({ success: true, message:  });
        });*/


});
//GET LIST OF PRODUCTS
router.get('/product', (req, res) => {
    queries
        .product
        .getAll()
        .then(product => {
            // res.json(product)
            res.render('product-page', {
                titles: product,
                tagline: "hello this is taglne"

            });
        })
})
//GET A SINGLE PRODUCT
router.get('/product/:id', (req, res) => {
    queries
        .product
        .getOne(req.params.id)
        .then(product => {
            res.json(product)

        });


});

router.post('/upload', upload.single('file'), function (err, req, res, next) {
    // res.send(req.files);
    const params = uploadParams;

    params.Key = req.file.originalname;
    params.Body = req.file.buffer;
    s3Client.upload(params, (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error -> " + err });
        }
        queries
            .product
            .updateUrl(req.params.id, req.file.location)
            .then(product => {
                res.render('upload_confirm', { file_location: req.file.location })


            });

    });
});
//SHOPPING CART STARTS
// add a single item to shopping cart
router.get('/add/:id', function (req, res, next) {

    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = products.filter(function (item) {
        return item.id == productId;
    });
    cart.add(product[0], productId);
    req.session.cart = cart;
    res.redirect('/');
    inline();
});
//get shoppiomg cart
router.get('/cart', function (req, res, next) {
    if (!req.session.cart) {
        return res.render('cart', {
            products: null
        });
    }
    var cart = new Cart(req.session.cart);
    res.render('cart', {
        title: 'NodeJS Shopping Cart',
        products: cart.getItems(),
        totalPrice: cart.totalPrice
    });
});
//remove shopping cart
router.get('/remove/:id', function (req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.remove(productId);
    req.session.cart = cart;
    res.redirect('/cart');
});



module.exports = router;
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orderModel');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);

router.get('/', (req, res) => {

    Order.find().select('_id product quantity').populate('product', 'name').exec().then(docs => {
        res.status(200).json(docs);
        console.log(docs);
    }).catch(err => {
        console.error(err);
    });
});

router.post('/', (req, res) => {

    let order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
    });

    order.save().then(doc => {
        console.log(doc);
        res.status(200).json(doc);
    }).catch(err => res.status(500).json(err));
});

router.put('/', (req, res) => {
    res.json({
        path: req.path,
        method: req.method
    });
});

router.delete('/', (req, res) => {

    

    res.json({
        path: req.path,
        method: req.method
    });
});

module.exports = router;
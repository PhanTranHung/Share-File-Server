const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const urljoin = require('url-join');

const Product = require('../models/productModel');
const checkAuth = require('../middleware/check-auth');

router.use(checkAuth);


function createResponse(productSchema, req) {
    return {
        name: productSchema.name,
        price: productSchema.price,
        _id: productSchema._id,
        request: {
            method: req.method,
            url: urljoin(req.protocol + "://" + req.hostname + ":" + req.client.localPort + req.originalUrl, productSchema._id.toString()),
        }
    }
}


router.get('/', (req, res) => {
    Product.find().select('name price _id').exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return createResponse(doc, req);
            })
        }
        res.status(200).json(response);
    }).catch(err => {
        console.error(err);
        res.status(500).json({
            error: err
        })
    });
});

router.get('/:productId', (req, res) => {
    const _id = req.params.productId;
    Product.findById(_id).exec().then(doc => {
        if (doc) {
            // console.log(docs);
            res.status(200).json({ product: createResponse(doc, req) });
        } else {
            res.status(404).json({
                message: "No valid entry found for provided ID",
            })
        }
    }).catch(err => {
        console.error(err);
        res.status(500).json(err)
    });
});

router.post('/', (req, res) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });

    product.save().then(doc => {
        res.json({
            message: 'Create product successfully',
            product: createResponse(doc, req),
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.put('/:productId', (req, res) => {
    updateOpts = {};
    // console.log(req.body);
    for (let opt of req.body)
        updateOpts[opt.propName] = opt.value;

    Product.updateOne({ _id: req.params.productId }, { $set: updateOpts }).exec().then(doc => {
        res.status(200).json({
            message: "Product updated",
            status: true
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json(err);
    });
});

router.delete('/:productId', (req, res) => {
    Product.remove({ _id: req.params.productId }).exec().then(docs => {
        res.status(200).json({
            message: "Product deleted",
            status: true
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: err });
    });
});

module.exports = router;
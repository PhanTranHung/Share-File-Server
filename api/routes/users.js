const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/userModel');

let catchErr = (stt, err, res, msg) => {
    console.error(err);
    res.status(stt).json({
        message: msg,
        error: err
    });
}


router.post('/signup', (req, res) => {
    User.findOne({ name: req.body.name }).exec()
        .then(result => {
            // res.json(result);
            if (result) res.status(409).json({ message: "The name already exists" });
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) console.error(err)
                    else {
                        let user = new User({
                            _id: mongoose.Types.ObjectId(),
                            name: req.body.name,
                            password: hash,
                        });
                        user.save()
                            .then(doc => res.status(200).json({ message: "successfully", doc: doc }))
                            .catch(err => catchErr(500, err, res, "Error when save user"));
                    }
                });
            }
        }).catch(err => catchErr(500, err, res, "Error when find user"));

});

router.post('/login', (req, res) => {
    User.findOne({ name: req.body.name }).exec()
        .then(user => {
            // res.json(result);
            if (!user) catchErr(401, null, res, 'Auth failed');
            else {
                let token = jwt.sign({
                    name: user.name,
                    _id: user._id
                }, process.env.JWT_KEY, {
                    expiresIn: "1h"
                });
                bcrypt.compare(req.body.password, user.password)
                    .then(result => {
                        if (result) res.json({ mgs: "success", token: token });
                        else catchErr(401, null, res, 'Auth failed');
                    })
                    .catch(err => catchErr(500, err, res, "An error occurs when authentication"));
            }
        })
        .catch(err => catchErr(500, err, res, "Error when find user"));
});


module.exports = router;
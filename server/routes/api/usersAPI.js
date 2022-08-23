// routes/api/userTrans.js

const express = require('express');
const router = express.Router();

// Load UserTrans model
const UsersModel = require('../../models/Users');


/**
 * @route GET users/test
 * @description Tests users route
 * @access Public
 */
router.get('/test', (req, res) => res.send('users route testing'));

/**
 * @route GET users
 * @description Get all users objects
 * @access Public
 */
router.get('/', (req, res) => {
    UsersModel.find()
        .then(users => res.json(users))
        .catch(err => res.status(404).json({ noUsersFound: '*No Users*' }));
});

/**
 * @route GET users/:username
 * @description Gets users object by username
 * @access Public
 */
router.get('/:username', (req, res) => {
    UsersModel.find({ username: req.params.username }, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

/**
 * @route POST users
 * @description Add users object 
 * @access Public
 */
router.post('/', (req, res) => {
    console.log(req.body.username);
    UsersModel.updateOne(
        { ethAddress: req.body.ethAddress}, 
        {
            username: req.body.username,
            name: req.body.name,
            ethAddress: req.body.ethAddress 
        },
        {upsert:true}, 
        (err, result) => {
            if (err) {
                res.json(err);
            } else {
                res.json(result);
            }
        }
    );
});

module.exports = router;
// Create web server
var express = require('express');
var router = express.Router();
var Comment = require('../models/comment');
var Post = require('../models/post');
var User = require('../models/user');

// Create comment
router.post('/', function(req, res, next) {
    // Check if user is logged in
    if(req.session.username) {
        // Create comment
        Comment.create({
            text: req.body.text,
            user: req.session.username,
            post: req.body.post
        }, function(err, comment) {
            if(err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                // Add comment to post
                Post.findByIdAndUpdate(
                    req.body.post,
                    { $push: { comments: comment._id } },
                    function(err, post) {
                        if(err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            // Add comment to user
                            User.findOneAndUpdate(
                                { username: req.session.username },
                                { $push: { comments: comment._id } },
                                function(err, user) {
                                    if(err) {
                                        console.log(err);
                                        res.status(500).send(err);
                                    } else {
                                        res.sendStatus(200);
                                    }
                                }
                            );
                        }
                    }
                );
            }
        });
    } else {
        res.sendStatus(401);
    }
});

// Get comments
router.get('/', function(req, res, next) {
    // Check if user is logged in
    if(req.session.username) {
        // Get comments
        Comment.find(function(err, comments) {
            if(err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(comments);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

// Get comment
router.get('/:id', function(req, res, next) {
    // Check if user is logged in
    if(req.session.username) {
        // Get comment
        Comment.findById(req.params.id, function(err, comment) {
            if(err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(comment);
            }
        });
    } else {
        res.sendStatus(401);
    }
});

// Update comment
router.put('/:id', function(req, res, next) {
    // Check if user is logged in


const express = require('express');
const router = express.Router();
const validation = require('./validation'); // import validation
const helper = require("../auth/helpers");

const postController = require('../controllers/postController');

router.get("/topics/:topicId/posts/new", postController.new); // route new

router.post("/topics/:topicId/posts/create",
   helper.ensureAuthenticated,
   validation.validatePosts,
   postController.create);


router.get("/topics/:topicId/posts/:id", postController.show); // route show posts

router.post("/topics/:topicId/posts/:id/destroy", postController.destroy);

router.get("/topics/:topicId/posts/:id/edit", postController.edit);

router.post("/topics/:topicId/posts/:id/update", validation.validatePosts, postController.update);
// update post and check all data are valid

module.exports = router;

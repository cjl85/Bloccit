const express = require( "express" );
const router = express.Router();

const flairController = require( "../controllers/flairController.js" );

router.get("/flairs", flairController.index);

router.get("/flairs/add", flairController.add);

router.post("/flairs/create", flairController.create);

router.get("/flairs/:id/view", flairController.view);

router.get("/flairs/:id/edit", flairController.edit);

router.post("/flairs/:id/update",flairController.update);

module.exports = router;

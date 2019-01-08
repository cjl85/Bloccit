
module.exports = {
  init(app){
    const staticRoutes = require("../routes/static");
    const topicRoutes = require("../routes/topics");
    const postRoutes = require("../routes/posts");
    const flairRoutes = require("../routes/flairs.js");
    const userRoutes = require("../routes/users");

    if(process.env.NODE_ENV === "test") {
     const mockAuth = require("../../spec/support/mock-auth.js");
     mockAuth.fakeIt(app);
   }

    app.use(topicRoutes);
    app.use(staticRoutes);
    app.use(postRoutes);
    app.use(flairRoutes);
    app.use(userRoutes);
  }
}

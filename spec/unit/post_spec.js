const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("Post", () => {

  const main = {
    topics: [{
      title: "Expeditions to Alpha Centauri",
      description: "A compilation of reports from recent visits to the star system."
    }, {
      title: "Challenges of interstellar travel",
      description: "1. The Wi-Fi is terrible"
    } ],
    posts: [{
      title: "My first visit to Proxima Centauri b",
      body: "I saw some rocks."
    }, {
      title: "Pros of Cryosleep during the long journey",
      body: "1. Not having to answer the 'are we there yet?' question."
    } ],
    users: [{
      email: "starman@tesla.com",
      password: "Trekkie4lyfe"
    }, {
      email: "ada@example.com",
      password: "password"
    }]
  };

  beforeEach((done) => {

    this.topic;
    this.post;
    this.user;

    sequelize.sync({force: true}).then((res) => {

      const values = main.users[0];

      User.create(values)
      .then((user) => {
        this.user = user;

        const values = {...main.topics[0]};
        values.posts = [{...main.posts[0]}];
        values.posts[0].userId = user.id;

        Topic.create(values, {include: {model: Post, as: "posts"}})
        .then((topic) => {
          this.topic = topic;
          this.post = topic.posts[0];
          done();
        } )
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });



  describe(".create()", () => {

    it("should create a post with specified " +
        "title, body, and associated topic and user", (done) => {

      const values = {...main.posts[1]};
      values.topicId = this.topic.id;
      values.userId = this.user.id;

      Post.create(values)
      .then((post) => {
        expect(post.title).toBe(values.title);
        expect(post.body).toBe(values.body);
        expect(post.topicId).toBe(values.topicId);
        expect(post.userId).toBe(values.userId);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should NOT create a post with missing " +
        "title, body, or associated topic and user", (done) => {

      Post.create({title: main.posts[1].title})
      .then((post) => {
        done();
      } )
      .catch((err) => {
        expect(err.message).toContain("notNull Violation");
        expect(err.message).toContain("Post.body cannot be null");
        expect(err.message).toContain("Post.topicId cannot be null");
        expect(err.message).toContain("Post.userId cannot be null");
        done();
      });
    });

  });



  describe(".setTopic()", () => {

    it("should associate post with specified topic", (done) => {

      const post = this.post;
      const oldTopic = this.topic;
      expect(post.topicId).toBe(oldTopic.id);

      const values = main.topics[1];

      Topic.create(values)
      .then((newTopic) => {

        post.setTopic(newTopic)
        .then((post) => {
          expect(post.topicId).not.toBe(oldTopic.id);
          expect(post.topicId).toBe(newTopic.id);
          done();
        });
      });
    });

  });



  describe(".getTopic()", () => {

    it("should return the associated topic", (done) => {

      this.post.getTopic()
      .then((topic) => {
        expect(topic.title).toBe(this.topic.title);
        done();
      });
    });

  });



  describe(".setUser()", () => {

    it("should associate post with specified user", (done) => {

      const post = this.post;
      const oldUser = this.user;
      expect(post.userId).toBe(oldUser.id);

      const values = main.users[1];

      User.create(values)
      .then((newUser) => {

        post.setUser(newUser)
        .then((post) => {
          expect(post.userId).not.toBe(oldUser.id);
          expect(post.userId).toBe(newUser.id);
          done();
        });
      });
    });
  });



  describe(".getUser()", () => {

    it("should return the associated user", (done) => {

      this.post.getUser()
      .then((user) => {
        expect(user.email).toBe(this.user.email);
        done();
      });
    });

  });

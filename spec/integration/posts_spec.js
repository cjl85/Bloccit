const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;

describe("routes : posts", () => {

  beforeEach((done) => {
     this.topic;
     this.post;
     this.user;

     sequelize.sync({force: true}).then((res) => {
       User.create({
         email: "starman@tesla.com",
         password: "Trekkie4lyfe"
       })
       .then((user) => {
         this.user = user;

         Topic.create({
           title: "Winter Games",
           description: "Post your Winter Games stories.",
           posts: [{
             title: "Snowball Fighting",
             body: "So much snow!",
             userId: this.user.id
           }]
         }, {
           include: {
            model: Post,
            as: "posts"
           }
         })
         .then((topic) => {
           this.topic = topic;
           this.post = topic.posts[0];
           done();
         })
       })
     });
   });
});

  describe('guest user performing CRUD actions for        posts', () => {
		beforeEach(done => {
			request.get(
				{
					url: 'http://localhost:3000/auth/fake',
					form: {
						role: user.role,
						userId: user.id,
            email: user.email,
					},
				},
				(err, res, body) => {
					done();
				},
			);
		});



  describe('admin user performing CRUD actions for posts', () => {
		  beforeEach(done => {
			  User.create({
				         email: 'admin@admin.com',
				      password: 'iamadmin',
				          role: 'admin',
			}).then(user => {
				request.get(
					{
						url: 'http://localhost:3000/auth/fake',
						form: {
							role: user.role,
							userId: user.id,
							email: user.email,
						},
					},
					(err, res, body) => {
						done();
					},
				);
			});
		});

describe("GET /topics/:topicId/posts/new", () => {

    it("should render a new post form", (done) => {
      request.get(`${base}/${topic.id}/posts/new`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("New Post");
        done();
      });
    });
  });

  describe("POST /topics/:topicId/posts/create", () => {

     it("should create a new post and redirect", (done) => {
        const options = {
          url: `${base}/${this.topic.id}/posts/create`,
          form: {
            title: "Watching snow melt",
            body: "Without a doubt my favoriting things to do besides watching paint dry!"
          }
        };
        request.post(options,
          (err, res, body) => {

            Post.findOne({where: {title: "Watching snow melt"}})
            .then((post) => {
              expect(post).not.toBeNull();
              expect(post.title).toBe("Watching snow melt");
              expect(post.body).toBe("Without a doubt my favoriting things to do besides watching paint dry!");
              expect(post.topicId).not.toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            });
          }
        );
      });

      it("should not create a new post that fails validations", (done) => {/* spec implementation */});

     it("should not create a new post that fails validations", (done) => {
       const options = {
         url: `${base}/${this.topic.id}/posts/create`,
         form: {

//#1
           title: "a",
           body: "b"
         }
       };

       request.post(options,
         (err, res, body) => {

//#2
           Post.findOne({where: {title: "a"}})
           .then((post) => {
               expect(post).toBeNull();
               done();
           })
           .catch((err) => {
             console.log(err);
             done();
           });
         }
       );
     });
   });

   describe("GET /topics/:topicId/posts/:id", () => {

     it("should render a view with the selected post", (done) => {
       request.get(`${base}/${this.topic.id}/posts/${this.post.id}`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Snowball Fighting");
         done();
       });
     });
   });

   describe("POST /topics/:topicId/posts/:id/destroy", () => {

     it("should delete the post with the associated ID", (done) => {

//#1
       expect(post.id).toBe(1);

       request.post(`${base}/${this.topic.id}/posts/${this.post.id}/destroy`, (err, res, body) => {

//#2
         Post.findById(1)
         .then((post) => {
           expect(err).toBeNull();
           expect(post).toBeNull();
           done();
         })
       });
     });
   });

   describe("GET /topics/:topicId/posts/:id/edit", () => {

     it("should render a view with an edit post form", (done) => {
       request.get(`${base}/${this.topic.id}/posts/${this.post.id}/edit`, (err, res, body) => {
         expect(err).toBeNull();
         expect(body).toContain("Edit Post");
         expect(body).toContain("Snowball Fighting");
         done();
       });
     });
   });

   describe("POST /topics/:topicId/posts/:id/update", () => {

     it("should return a status code 302", (done) => {
       request.post({
         url: `${base}/${topic.id}/posts/${post.id}/update`,
         form: {
           title: "Snowman Building Competition",
           body: "I love watching them melt slowly."
         }
       }, (err, res, body) => {
         expect(res.statusCode).toBe(302);
         done();
       });
     });

     it("should update the post with the given values", (done) => {
         const options = {
           url: `${base}/${this.topic.id}/posts/${this.post.id}/update`,
           form: {
             title: "Snowman Building Competition"
           }
         };
         request.post(options,
           (err, res, body) => {

           expect(err).toBeNull();

           Post.findOne({
             where: {id: this.post.id}
           })
           .then((post) => {
             expect(post.title).toBe("Snowman Building Competition");
             done();
           });
         });
     });
   });

   describe("getPoints()", () => {

    it("should return the sum of associated vote values", (done) => {

      const options = {include: [{model: Vote, as: "votes"}]};

      Post.findByPk(this.post.id, options)
      .then((post) => {
        expect(post.getPoints()).toBe(0); // no votes

        const values = {
          value: UPVOTE,
          postId: post.id,
          userId: this.user.id,
        };

        Vote.create(values)
        .then((vote) => {
          expect(vote.value).toBe(1);

          post.reload(options)
          .then((post) => {
            expect(post.getPoints()).toBe(1); // +1

            vote.value = -1;
            vote.save()
            .then((vote) => {
              expect(vote.value).toBe(-1);

              post.reload(options)
              .then((post) => {
                expect(post.getPoints()).toBe(-1); // +1
                done();
              });
            });
          });
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("hasUpvoteFor()", () => {

    it("should return TRUE if user has upvoted", (done) => {

      const user = this.user;
      const options = {include: [{model: Vote, as: "votes"}]};

      Post.findById(this.post.id, options
      .then((post) => {
        expect(post.hasUpvoteFor(user.id)).toBeFalse();

        const values = {value: 1, postId: post.id, userId: user.id,};

        Vote.create(values)
        .then((vote) => {
          expect(vote.value).toBe(1);

          post.reload(options)
          .then((post) => {
            expect(post.hasUpvoteFor(user.id)).toBeTrue();
            expect(post.hasDownvoteFor(user.id)).toBeFalse();
            done();
          });
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("hasDownvoteFor()", () => {

    it("should return TRUE if user has downvoted", (done) => {

      const user = this.user;
      const options = {include: [{model: Vote, as: "votes"}]};

      Post.findById(this.post.id, options
      .then((post) => {
        expect(post.hasDownvoteFor(user.id)).toBeFalse();

        const values = {value: -1, postId: post.id, userId: user.id,};

        Vote.create(values)
        .then((vote) => {
          expect(vote.value).toBe(-1);

          post.reload(options)
          .then((post) => {
            expect(post.hasDownvoteFor(user.id)).toBeTrue();
            expect(post.hasUpvoteFor(user.id)).toBeFalse();
            done();
          });
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

const sequelize = require( "../../src/db/models/index.js" ).sequelize;
const Topic = require( "../../src/db/models" ).Topic;
const Post = require( "../../src/db/models" ).Post;
const User = require("../../src/db/models").User;


describe( "Topic", () => {

  const main = {
    topics: [
      {
        title: "Expeditions to Alpha Centauri",
        description: "A compilation of reports from recent visits to the star system."
      },
      {
        title: "Challenges of interstellar travel",
        description: "1. The Wi-Fi is terrible"
      }
    ],
    posts: [
      {
        title: "My first visit to Proxima Centauri b",
        body: "I saw some rocks."
      },
      {
        title: "Pros of Cryosleep during the long journey",
        body: "1. Not having to answer the 'are we there yet?' question."
      }
    ]
  };

  beforeEach((done) => {
     this.topic;
     this.post;
     this.user;

     sequelize.sync({force: true}).then((res) => {

// #2
       User.create({
         email: "starman@tesla.com",
         password: "Trekkie4lyfe"
       })
       .then((user) => {
         this.user = user; //store the user

// #3
         Topic.create({
           title: "Expeditions to Alpha Centauri",
           description: "A compilation of reports from recent visits to the star system.",

// #4
           posts: [{
             title: "My first visit to Proxima Centauri b",
             body: "I saw some rocks.",
             userId: this.user.id
           }]
         }, {

// #5
           include: {
             model: Post,
             as: "posts"
           }
         })
         .then((topic) => {
           this.topic = topic; //store the topic
           this.post = topic.posts[0]; //store the post
           done();
         })
       })
     });
   });


  describe( ".create()", () => {

    const data = main.topics[1]; // "Challenges of interstellar travel"

    it( "should create Topic instance with specified values", ( done ) => {

      Topic.create( {
        title: data.title,
        description: data.description,
      } )
      .then( ( topic ) => {
        expect( topic.title ).toBe( data.title );
        expect( topic.description ).toBe( data.description );
        done();
      } )
      .catch( ( err ) => {
        console.log( err );
        done();
      } );
    } );

  } );



  describe( ".getPosts()", () => {

    it( "should return an array of Post instances " +
        "associated with Topic", ( done ) => {

      const topic = this.topic;
      const topicId = topic.id;


      const data = main.posts.map( ( props ) => {
        let post = { ...props };
        post.topicId = topicId;
        return post;
      });

      topic.getPosts()
      .then((postsBefore) => {
        expect(postsBefore.length).toBe(0);

        Post.bulkCreate(data)
        .then((newPosts) => {
          expect(newPosts.length).toBe( data.length);

          topic.getPosts()
          .then((postsAfter) => {
            expect(postsAfter.length ).not.toBe(postsBefore.length);
            expect(postsAfter.length).toBe( newPosts.length);

            expect(postsAfter[0].title).toBe(data[0].title);
            expect(postsAfter[0].body ).toBe( data[0].body);
            expect(postsAfter[0].topicId ).toBe(data[0].topicId);
            expect(postsAfter[0].topicId ).toBe(topicId);
            done();
          } );
        } );
      } )
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});

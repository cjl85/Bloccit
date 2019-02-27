const Flair = require( "./models" ).Flair;

module.exports = {
  selectAll(callback) {
    return Flair.all()
      .then((adverts) => { callback(null, adverts); })
      .catch((err) => { callback(err);
    })
  },

  select(id, callback) {
    return
      Flair.findById(id)
      .then((advert) => { callback(null, advert);})
      .catch((err) => {callback( err);})

  },

  insert(data, callback) {
    return
      Flair.create({
        title: data.title,
        description: data.description
      })
      .then( (advert) => { callback(null, advert); })
      .catch((err) => { callback(err); })

  },

  update(id, data, callback) {
    return
      Flair.findById(id)
      .then((advert) => {
        if (!advert) { return callback( "Flair not found."); }
        advert.update(data, {
          fields: Object.keys( data)
        })
        .then((advert) => { callback(null, advert); } )
        .catch((err) => { callback(err);});
      })
  },

  delete(id, callback) {
    return
      Flair.destroy({ where: {id} })
      .then( (advert) => { callback(null, advert); })
      .catch((err) => {callback(err);})

  }
};

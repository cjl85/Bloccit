
const Advertisement = require( "./models" ).Advertisement;

module.exports = {
  selectAll(callback) {
    return Advertisement.all()
      .then((adverts) => { callback(null, adverts); })
      .catch((err) => { callback(err);
    })
  }

  select(id, callback) {
    return
      Advertisement.findById(id)
      .then((advert) => { callback(null, advert);})
      .catch((err) => {callback( err);})

  }
  ,
  insert(data, callback) {
    return
      Advertisement.create({
        title: data.title,
        description: data.description
      })
      .then( (advert) => { callback(null, advert); })
      .catch((err) => { callback(err); })

  }
  ,
  update(id, data, callback) {
    return
      Advertisement.findById(id)
      .then((advert) => {
        if (!advert) { return callback( "Advertisement not found."); }
        advert.update(data, {
          fields: Object.keys( data)
        })
        .then((advert) => { callback(null, advert); } )
        .catch((err) => { callback(err);});
      })
  }

  delete(id, callback) {
    return
      Advertisement.destroy({ where: {id} })
      .then( (advert) => { callback(null, advert); })
      .catch((err) => {callback(err);})

  }
};

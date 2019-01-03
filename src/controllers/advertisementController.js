const advertQueries = require("../db/queries.advertisements.js");

module.exports = {
  index(req, res, next) {
    queries.selectAll((err, adverts) => {
      if (err) {res.redirect(500, "static/index");}
      else {res.render("advertisements/index", {adverts});}
    });
  }

  new(req, res, next) {
    res.render("advertisements/new");
  }

  create(req, res, next) {
    const newAdvert = {
      title: req.body.title,
      description: req.body.description
    };
    advertQueries.addAdvert(newAdvert, (err, advert) => {
      if (err) {res.redirect(500, "advertisements/new");}
      else {res.redirect(303, `/advertisements/${advert.id}` );}
    });
  }

  view(req, res, next) {

    advertQueries.getView(req.params.id, (err, advert) => {
      if (err || advert == null) { res.redirect(404, "/");}
      else {res.render( "advertisements/view", { advert}); }
    });
  }

  edit(req, res, next) {

    advertQueries.getAdvert(req.params.id, (err, advert) => {
      if (err || advert == null) { res.redirect(404, "/");}
      else {res.render( "advertisements/edit", {advert});}
    });
  }

  update(req, res, next) {

    advertQueries.update(req.params.id, req.body, (err, advert) => {
      if (err || advert == null) {
        res.redirect(404, `/advertisements/${req.params.id}/edit`);
      }
      else {res.redirect(303, `/advertisements/${advert.id }`);}
    });
  }

  destroy(req, res, next) {
    advertQueries.destoryAdvert( req.params.id, (err, advert) => {
      if (err) {res.redirect(500, `/advertisements/${advert.id }`); }
      else {res.redirect(303, "/advertisements");}
    } );
  }
};

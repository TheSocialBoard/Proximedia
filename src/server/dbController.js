const pgp = require('pg-promise')();
const url = require('../private/dbURL');


module.exports = {
  checkUser: function (req, res, next) {
    const db = pgp(url);
    console.log(db);
    db.any(`SELECT * FROM "user" WHERE user.github_id = ${res.locals.githubinfo.id}`)
      .then((data) => {
        if(data) {
          res.locals.status = true
          res.locals.user = data;
          next()
        }
      })
  },
  createUser: function (req, res, next) {
    const db = pgp(url);
    if(res.locals.status) {
    db.any(`INSERT STATEMENT`)
      .then((data) => {
        //check if insert worked
        res.send(res.locals.user)
      })
      .catch((err) => {
        res.send({ err });
      })
    }
  }
}
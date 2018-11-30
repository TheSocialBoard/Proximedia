const pgp = require('pg-promise')();
const url = require('../private/dbURL');


module.exports = {
  checkUser: function (req, res, next) {
    const db = pgp(url);
    db.one(`SELECT * FROM "user" WHERE "user".github_id = '${res.locals.githubinfo.id}';`)
      .then((data) => {
        if(data) {
          res.locals.status = true
          res.locals.user = data;
          res.send({user:res.locals.user})
        } 
      })
      .catch(() => {
        next();
      })
  },
  createUser: function (req, res, next) {
    const db = pgp(url);
    db.any(`INSERT INTO "user" (login, github_id, avatar_url) VALUES ('${res.locals.githubinfo.login}', '${res.locals.githubinfo.id}', '${res.locals.githubinfo.avatar_url}') RETURNING *`)
    .then((data) => {
     res.send({ user: data })
    })
  },
  inputLocation: function (req, res, next) {
    const db = pgp(url);
    db.any(`UPDATE "user" SET `)
  }
}
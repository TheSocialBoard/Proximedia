const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const githubController = require('./githubController');
const tweetController = require('./tweetController');
const dbController = require('./dbController');

const app = express();

// connect to SQL database
const url = require('../private/dbURL');

// use statements
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../../dist')));

// cors functionality
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '../../index.html');
});

// authenticate requests
app.get('/auth/github', githubController.authenticate, (req, res) => {
  res.redirect(res.locals.url);
})

app.get('/oauth2/github/callback',
 githubController.accessToken, dbController.checkUser, dbController.createUser, (req, res) => {

 });

// app.get('/user', function(req, res) {
//   var token = req.cookies.token;
//   var options = {
//     url: 'https://api.github.com/user',
//     headers: {
//       'user-agent': 'articuno',
//       'Accept': 'application/json',
//       'Authorization': 'token ' + token
//     },
//     json: true
//   };
//   request(options, function(err, resp, body) {
//     res.send(body);
//   });
// });

app.get('/:query',
  tweetController.getTweets,
  // send the tweets to the elastic
  (req, res) => {
    res.send(res.locals);
})

app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log('Kubernetes is the way of life');
});

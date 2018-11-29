const Twitter = require('twitter-node-client').Twitter;
const config = require('../private/twitterConfig');
const twitter = new Twitter(config);
const tweetController = {};

// error handling for faulty fetch
const error = function (err, response, body) {
  console.log('Error on Search Twitter', JSON.stringify(JSON.parse(err), null, 2));
};

// middleware function to get tweets from twitter api which match the user query
tweetController.getTweets = (req, res, next) => {
  console.log('req.url', req.url);
  const userQuery = req.url
  console.log('Searching Twitter for: \'' + userQuery + '\'');
  twitter.getSearch(
    {'q': userQuery,'count': 200}, 
    error, 
    data => {
      console.log(data);
      data = JSON.parse((data), null, 2);
      // before delivering the data we are going to create partitions of data so the redux end can quickly render the page by creating a state based on the data package
      // this data will occur in res.locals as a detailed tweet object
      // .tweets = an array of all tweet objects
      res.locals.tweets = JSON.stringify(data.statuses);
      res.locals.hashtags = {};
      res.locals.favorites = {};
      res.locals.retweets = {};
      data.statuses.forEach((tweetObject, index) => {
        // check the tweet, if it is not in english get rid of it
        if (tweetObject.metadata.iso_language_code !== "en") {
          data.statuses.splice(index, 1);
        }
        else {
          // .hashtags = an object with the following key/value pairs: the number of tweets using this hashtag and an array of those ids
          tweetObject.entities.hashtags.forEach(hashtag => {
            if (res.locals.hashtags[hashtag.text]){
              res.locals.hashtags[hashtag.text].tweetIds.push(tweetObject.id);
              res.locals.hashtags[hashtag.text].count += 1;
            }
            else {
              res.locals.hashtags[hashtag.text] = {
                tweetIds: [tweetObject.id],
                count: 1,
              }
            }
          });
          // .favorites = an object with one key/value pair: id and number of likes for that id
          if (tweetObject.retweeted_status) {
            res.locals.favorites[tweetObject.id] = tweetObject.retweeted_status.favorite_count;
          }
          // .retweets = an object with one key/value pair: id and number of retweets
          if (tweetObject.retweeted_status) {
            res.locals.retweets[tweetObject.id] = tweetObject.retweeted_status.retweet_count;
          }
        }
      });
      res.locals.hashtags = JSON.stringify(res.locals.hashtags);
      res.locals.favorites = JSON.stringify(res.locals.favorites);
      // .location = an object with one key value pair: location and array of tweet ids
      // .users = an object with one key value pair: user and number of followers
      next();
    });
}

module.exports = tweetController;

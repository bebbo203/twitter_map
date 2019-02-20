
// https://gist.github.com/1964797

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('express-logger');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var inspect = require('util-inspect');
var oauth = require('oauth');
var sys = require('sys');
const genuuid = require('uuid/v1');


var app = express();

var fs = require('fs');
var _twitterConsumerKey = "fpkpDpNcr3zEdppgrDxwTQ";
var _twitterConsumerSecret = "bmff9GhM8nh1EZVZmJeGEMKONP1m46FVDahlbU0EOk";

var GID;

function consumer() {
    return new oauth.OAuth(
        "https://twitter.com/oauth/request_token", "https://twitter.com/oauth/access_token",
        _twitterConsumerKey, _twitterConsumerSecret, "1.0A", "http://127.0.0.1:8888/sessions/callback", "HMAC-SHA1");
}


app.use(cookieParser());
app.use(session({genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  }, secret: "very secret", resave: false, saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(logger({ path: "log/express.log"}));

console.log("IN");


/*app.dynamicHelpers({
    session: function(req, res){
        return req.session;
    }
});
*/

app.get('/', function(req, res){
    res.send('Hello World');
});



app.get('/sessions/connect', function(req, res){
    consumer().getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
        if (error) {
            res.status(500).send("Error getting OAuth request token : " + sys.inspect(error));
        } else {
            console.log("!!"+oauthToken);
            console.log("!!"+oauthTokenSecret);
            console.log("ID1:"+ req.sessionID)

            req.session.oauthRequestToken = oauthToken;
            req.session.oauthRequestTokenSecret = oauthTokenSecret;
            GID = req.session;
            
            res.redirect("https://twitter.com/oauth/authorize?oauth_token="+req.session.oauthRequestToken);
        }
    });
});

app.get('/sessions/callback', function(req, res){
    req.session = GID;
    console.log(">>"+req.session.oauthRequestToken);
    console.log(">>"+req.session.oauthRequestTokenSecret);
    console.log(">>"+req.query.oauth_verifier);
    console.log("ID2:"+req.sessionID);
    consumer().getOAuthAccessToken(req.session.oauthRequestToken, req.session.oauthRequestTokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
        if (error) {
            res.status(500).send("Error getting OAuth access token : " + sys.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+sys.inspect(results)+"]");
        } else {
            req.session.oauthAccessToken = oauthAccessToken;
            req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
            // Right here is where we would write out some nice user stuff
            consumer().get("https://api.twitter.com/1.1/account/verify_credentials.json", req.session.oauthAccessToken, req.session.oauthAccessTokenSecret, function (error, data, response) {
                if (error) {
                    res.status(500).send("Error getting twitter screen name : " + sys.inspect(error));
                } else {
                    console.log("data is %j", data);
                    data = JSON.parse(data);
                    req.session.twitterScreenName = data["screen_name"];
                    res.redirect("http://172.28.1.3:8000?name="+req.session.twitterScreenName);

                    //res.send('You are signed in: ' + req.session.twitterScreenName)
                }
            });
        }
    });
});

app.listen(8888);

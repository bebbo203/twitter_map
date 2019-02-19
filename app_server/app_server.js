var https = require('https');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
var twitter = require('twitter');
var app = express();

app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); 


var client = new twitter({
    consumer_key: 'fpkpDpNcr3zEdppgrDxwTQ',
    consumer_secret: 'bmff9GhM8nh1EZVZmJeGEMKONP1m46FVDahlbU0EOk',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAAMOIVQAAAAAAScxtJ4DcSFGcJW1IKuQVSrHOQgE%3DvJwGYGPP2Smit3C4hrym8ZmleDt4XLFVuJueSlfaHy31kZJBV2'
});




app.get('/',function(req, res){

    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("tweet.html", "UTF-8").pipe(res);
    
});

app.post('/click',function(req, res){

    console.log("IN");

    var text_form = req.body.dname;

    var params = {
        q: '%23'+text_form,
        count: '100'
        //geocode: "37.781157,-122.398720,5000km"
    };
    
    client.get('search/tweets', params, function(error, tweets, response) {
        if (!error)
        {
            var tweets_stringified = JSON.stringify(tweets);
            var parsed_tweets = JSON.parse(tweets_stringified);

            for(var i=0; i<parsed_tweets.statuses.length; i++)
            {
                var tweet = parsed_tweets.statuses[i];
                console.log(tweet.user.location);
                console.log(tweet.coordinates);
                console.log("++++++++++++++++++");
            }
        }
        else
        {
            console.log("ERROR: "+error);
        }
    });

    res.redirect("/");

});


app.listen(8081);



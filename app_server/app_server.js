var https = require('https');
var http = require('http');
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser')
var twitter = require('twitter');
var request = require('request');
var session = require('express-session');
const genuuid = require('uuid/v1');


var app = express();

app.use( bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({extended: true})); 


var locations = []
var coords = []
var tweet_print = []

var client = new twitter({
    consumer_key: 'fpkpDpNcr3zEdppgrDxwTQ',
    consumer_secret: 'bmff9GhM8nh1EZVZmJeGEMKONP1m46FVDahlbU0EOk',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAAMOIVQAAAAAAScxtJ4DcSFGcJW1IKuQVSrHOQgE%3DvJwGYGPP2Smit3C4hrym8ZmleDt4XLFVuJueSlfaHy31kZJBV2'
});




app.get('/',function(req, res)
{

    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("tweet.html", "UTF-8").pipe(res);
    
});

app.post('/click',function(req, res)
{

    console.log("IN");

    if(req.body.dname == "")
    {
        res.redirect("/");
        return;
    } 

    locations = []
    coords = []
    tweet_print = []
    text_form = req.body.dname;

    console.log(text_form);

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
                console.log(tweet.coordinates);

                if(tweet.coordinates != null) 
                {
                    coords.push(tweet.coordinates);
                    
                    tweet_print.push(tweet.text);
                    
                    console.log(tweet.text);
                    console.log(tweet.coordinates);
                    console.log("++++++++");
                    
                }
                else
                {
                    if(tweet.user.location != null || tweet.user.location != '') 
                    {
                        locations.push(tweet.user.location);
                    }

                }

            }

            console.log(coords);
            res.redirect("/map");
        }
        else
        {
            console.log("ERROR SEARCHING TWEET: "+error);
            res.send(error);
        }
    });

    

});


app.get('/map', function(req, res)
{
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("map.html", "UTF-8").pipe(res);
});

app.get('/map/coords', function(req, res)
{
   var data = '';
   var promises = [];
   var ret = []


   for(var i=0;i<coords.length; i++)
   {
       var obj = {
           "coords": coords[i],
           "text": tweet_print[i]
       }

       ret.push(obj);
   }
   console.log("locations length: "+locations.length);


   res.json(ret);
  

});

//Returns a JSON array with the coordinates of the city in param city_tag
app.get('/get_location', function(req, res)
{
    var city_tag = req.param("city_name");
    var access_token_map = 'pk.eyJ1IjoiYmViYm8yMDMiLCJhIjoiY2pzOWNxZTFjMWZ5bjN5bzNoY3l2azR2diJ9.NB9mBOvbuV3127OGeyV0_w';
    var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURI(city_tag) +'.json?access_token='+access_token_map;
    var data = '';

    console.log(city_tag);

    https.get(url, (resp) => {
       
        data = "";
    // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

    // The whole response has been received. Print out the result.
        resp.on('end', () => {
            var query_loc = JSON.parse(data);
            console.log(data)
            //console.log("QUERY_LOC: "+JSON.stringify(query_loc));
            if(query_loc.message == "Not Found" || query_loc.message == "Not Authorized - No Token" || query_loc.features.length == 0)
            {
                res.status(400); 
                res.send("[]");
            }
            else 
            {
                console.log("RISOLTO");
                var ret = [];
                ret.push(query_loc.features[0].center[1]);
                ret.push(query_loc.features[0].center[0]);
                res.status(200);
                res.send(JSON.stringify(ret));
            }
            
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

});

//Latest N tweets
app.get('/last_tweets', function(req, res)
{

    var query = req.param('hashtag');
    var N = req.param('N');

    if(N ==null || query == null)
    {
        res.status(400);
        res.send("[]");
    }
    else
    {
        var ret = [];

        var params = {
            q: '%23'+query,
            count: N
            };

        console.log("IL PARAMETRO: "+query);
        client.get('search/tweets', params, function(error, tweets, response) 
        {

            if(error)
            {
                res.status(400);
                res.send("[]");
            }
            else
            {
                var tweets_stringified = JSON.stringify(tweets);
                var tweets_parsed = JSON.parse(tweets_stringified);

                for(var i=0;i<tweets_parsed.statuses.length;i++)
                {
                    ret.push(tweets_parsed.statuses[i].text)
                }

                res.send(JSON.stringify(ret));
                ret = []
            }

        });
    }

});


app.get('/get_location_reverse', function(req, res){
    var lat = req.param("lat");
    var lng = req.param("lng");
    console.log("DENTRO");

    if(lat==null || lng==null)
    {
        res.status(400);
        res.send("");
        return;
    }

    var access_token_map = 'pk.eyJ1IjoiYmViYm8yMDMiLCJhIjoiY2pzOWNxZTFjMWZ5bjN5bzNoY3l2azR2diJ9.NB9mBOvbuV3127OGeyV0_w';
    var url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + lng + ','+lat+'.json?access_token='+access_token_map;
    var data = '';



    https.get(url, (resp) => {

    data = "";
// A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

// The whole response has been received. Print out the result.
    resp.on('end', () => {
        var query_loc = JSON.parse(data);
        console.log(data)
        //console.log("QUERY_LOC: "+JSON.stringify(query_loc));
        if(query_loc.message == "Not Found" || query_loc.message == "Not Authorized - No Token" || query_loc.features.length == 0)
        {
            res.status(400); 
            res.send("");
        }
        else 
        {
            console.log("RISOLTO");
            var ret = [];
            
            res.status(200);
            res.send(query_loc.features[0].place_name);
        }
        
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });

});












app.listen(8080);



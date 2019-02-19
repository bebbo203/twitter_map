var http = require('http');

function search()
{
    http.get('https://api.twitter.com/1.1/search/tweets.json?geocode=37.781157,-122.398720,50mi', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        console.log(JSON.parse(data).text);
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
}

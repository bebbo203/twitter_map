const express=require('express');
const app=express();
var http = require('http');


app.set('views', __dirname + '/template');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/assets'));
app.get("/", function(req,res){
  res.render("chatroom");
});


var io = require('socket.io').listen(app.listen(8000));
console.log("Listening on port 8000");

io.sockets.on('connection', function (socket) {
  socket.emit('message', { message: 'Benvenuto in chat' });
  socket.on('send', function (data) {

    var risposta = "";
    var text = data.message;
    var data = "";
    var bird = "&#x270F"

    var url = "http://172.28.1.2:8081/chat?chat_query="+text;
    console.log("URL:"+url)
    http.get(url, (resp) => {
      
       console.log("START");
        data = "";
    // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

    // The whole response has been received. Print out the result.
        resp.on('end', () => {

          var tweets = JSON.parse(data);
          console.log("LENGTH: "+tweets.length);

          io.sockets.emit('message', {message: "Ho trovato "+tweets.length+" tweet con l'hashtag #"+text+":"});


          for(var i=0;i<tweets.length;i++)
          {
              io.sockets.emit('message', {message: bird+tweets[i]});
          }



            

            console.log("FINEEE");
        });

    }).on("error", (err) => {
        console.log("Errorrrrrr: " + err.message);
  });



    //io.sockets.emit('message', {message: data});
  });
});


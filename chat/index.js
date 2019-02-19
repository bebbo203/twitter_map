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

    var text = data.message;
    var data = "";

    http.get("http://172.19.0.4:8081/click?chat_param="+text, (resp) => {
      
       console.log("START");
        data = "";
    // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

    // The whole response has been received. Print out the result.
        resp.on('end', () => {

          var tweets = JSON.parse(data);
          var risposta = "------->";
          for(var i=0;i<tweets.length;tweets++)
          {
              risposta += tweets[i]+"\n";
          }



          io.sockets.emit('message', {message: risposta});

            console.log(data);
        });

    }).on("error", (err) => {
        console.log("Errorrrrrr: " + err.message);
  });



    //io.sockets.emit('message', {message: data});
  });
});


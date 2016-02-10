var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));


var counter = 1;

app.get('/', function(req, res){
  res.send('index.html');
});

io.on('connection', function(socket){

  socket['username'] = counter;
  counter++;

// notify sign on of user
  io.emit('user sign-on', {"message" : "Someone Has Signed On"})

// change username
  socket.on('change username', function(msg){
    socket['username'] = msg;
  });

// reveive and send out chat message
  socket.on('chat message', function(msg){
  	var data = {
  	  "message" : msg,
  	  "username" : socket.username	
  	}
    io.emit('chat message', data);
  });

  socket.on('user typing', function(msg){
    var data = {
      "username": socket.username
    }
    io.emit('user typing', data)
  })

// disconnect
  socket.on('disconnect', function(){
    io.emit('disconnect_msg', socket.username + ' has disconnected');
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});


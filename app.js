var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

// var users = [],
    // counter = 1;
var counter = 1;

app.get('/', function(req, res){
  res.send('index.html');
});

io.on('connection', function(socket){
  console.log('user connected')

  socket['username'] = counter;
  counter++;

  io.emit('user sign-on', {"message" : "Someone Has Signed On"})
  // users.append(socket)
  socket.on('change username', function(msg){
    console.log(msg);
    socket['username'] = msg;
  });

  socket.on('chat message', function(msg){
  	var data = {
  	  "message" : msg,
  	  "username" : socket.username	
  	}
    io.emit('chat message', data);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('disconnect_msg', socket.username + ' has disconnected');
  });

});


http.listen(3000, function(){
  console.log('listening on *:3000');
});


var socket = io();

// user signs on
socket.on('user sign-on', function(data){
  var $welcome = $('<li>').attr('class', 'sign-on').text(data.message);
  $('#messages').append($welcome)
})

// sending messages
$('#sending > button').on('click', function(){
  socket.emit('chat message', $('textarea').val());
  $('textarea').val('');
  return false;
});

$("textarea").keyup(function(event){
    if(event.keyCode == 13 && $("textarea").val() !== ""){
        $("#sending > button").click();
    }
});

// getting chat message
socket.on('chat message', function(data){
  var fixedData = data.message.split(' ');
  //checks for images
  if(/https?.*(jpg|png|gif)/.test(data.message)){
    fixedData.forEach(function(word, index){
      if(/^https?.*(jpg$|png$|gif$)/.test(word.trim())){
        var img = '</br><img src="' + word + '"></br>';
        fixedData.unshift(img)
      }
    })
  }
  //checks for website links
  if(/https?:\/\/|www./.test(data.message)){
    fixedData.forEach(function(word, index){
      if(/^https?:\/\/|^www./.test(word)){
        var link = '<a href ="' + word + '">' + word + '</a>';
        fixedData[index] = link; 
      }
    });
  }

  var newData = fixedData.join(' ');
  $('#messages').append('<li>' + data.username + ": " +newData + '</li>');

});

// changing username
$('#username > button').on('click', function(){
	socket.emit('change username', $('#username > input').val());
	return false;
});

$("#username > input").keyup(function(event){
    if(event.keyCode == 13 && $("username > input").val() !== ""){
        $("#username > button").click();
    }
});

// on user disconnect
socket.on('disconnect_msg', function(data){
  $('#messages').append($('<li>').attr('class', 'sign-on').text(data));
});


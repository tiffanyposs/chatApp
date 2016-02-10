$('document').ready(function(){

  var socket = io();

  // USER SIGNS ON
  socket.on('user sign-on', function(data){
    var $welcome = $('<li>').attr('class', 'sign-on').text(data.message);
    $('#messages').append($welcome)
  })
  //END USER SIGNS ON

  // SENDING MESSAGES
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
  //END SENDING MESSAGES

  // CHANGING USERNAME
  $('#username > button').on('click', function(){
    socket.emit('change username', $('#username > input').val());
    return false;
  });

  $("#username > input").keyup(function(event){
      if(event.keyCode == 13 && $("username > input").val() !== ""){
          $("#username > button").click();
      }
  });
  //END CHANGING USERNAME

  // GETTING CHAT MESSAGE
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

  }); // END GETTING CHAT MESSAGE

  // USER TYPING
  $("#sending textarea").keyup(function(event){
    socket.emit('user typing', '')
  });

  var userTyping = false;
  var activeTypers = [];
  socket.on('user typing', function(data){
    var inArray = $.inArray(data.username, activeTypers);
    if(inArray === -1){
      activeTypers.push(data.username);
    }
    var typeString;
    if(activeTypers.length === 1){
      typeString = activeTypers[0] + ' is typing';
    }else if(activeTypers.length === 2){
      typeString = activeTypers[0] + 'and' + activeTypers[1] + 'are typing';
    }else{
      typeString = 'Many people are typing';
    }
    $('#user-typing').text(typeString);
    userTyping = true;
    window.setTimeout(function(){
      userTyping = false;
    }, 2000);
    window.setTimeout(function(){
      $('#user-typing').text('');
      activeTypers.forEach(function(user, index){
        if(data.username === user){
          activeTypers.splice(index, 1);
        }
      });
    }, 2500);
  });
  //END USER TYPING



  // on user disconnect
  socket.on('disconnect_msg', function(data){
    $('#messages').append($('<li>').attr('class', 'sign-on').text(data));
  });

});
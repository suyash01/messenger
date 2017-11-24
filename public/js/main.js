$(function () {
    var socket = io();

    //Sending new message
    $('#msgForm').submit(function(){
        socket.emit('message', $('#msg').val());
        $('#msg').val('');
        return false;
    });

    //Receiving new message
    socket.on('message', function(name, msg){
        $('#chat').append('<div class="alert alert-success"><b>'+name+'</b><br>'+msg+'</div><br>');
        var chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
    });

    //Username emit
    $('#userForm').submit(function(){
        var name = $('#uname').val();
        if(name != "" && name != null && name != undefined){
            socket.emit('join', name);
            $('#userModal').modal('hide');
            $('.container').show();
        }
        return false;
    });

    //Updating the online user list
    socket.on('update users', function(users){
        var html = '';
        for(var key in users)
            if(users.hasOwnProperty(key))
                html += '<li class="list-group-item">'+users[key]+'</li>';
        $('#numUser').text(Object.keys(users).length);
        $('#users').html(html);
    });

    //Notification handling
    socket.on('notification', function(type, name){
        if(type)
            $('#chat').append('<div class="alert alert-danger"><b>'+name+'</b> left the chat</div>');
        else
            $('#chat').append('<div class="alert alert-warning"><b>'+name+'</b> joined the chat</div>')
    });
});

//Preventing modal from closing when clicking outside or pressing esc key
$('#userModal').modal({
    backdrop: 'static',
    keyboard: false
});

//Showing modal on startup
$('#userModal').modal('show');

//Autofocus to modal input
$('#userModal').on('shown.bs.modal', function () {
  $(this).find('[autofocus]').focus();
})

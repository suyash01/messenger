$(function () {
    var socket = io();

    //Message emit
    $('#msgForm').submit(function(){
        socket.emit('new message', $('#msg').val());
        $('#msg').val('');
        return false;
    });
    socket.on('new message', function(data){
        $('#chat').append('<div class="alert alert-success"><b>'+data.user+': </b>'+data.msg+'</div><br>');
        var chat = document.getElementById("chat");
        chat.scrollTop = chat.scrollHeight;
    });

    //Username emit
    $('#userForm').submit(function(){
        socket.emit('user join', $('#uname').val());
        $('#userModal').modal('hide');
        $('.container').show();
        return false;
    });
    socket.on('new user', function(data){
        var html = '';
        for(i=0;i<data.users.length;i++){
            html += '<li class="list-group-item">'+data.users[i]+'</li>';
        }
        $('#numUser').text(data.users.length);
        $('#users').html(html);
        $('#chat').append('<div class="alert alert-warning"><b>'+data.user+'</b> joined the chat</div>');
    });

    socket.on('user left', function(data){
        var html = '';
        for(i=0;i<data.users.length;i++){
            html += '<li class="list-group-item">'+data.users[i]+'</li>';
        }
        $('#numUser').text(data.users.length);
        $('#users').html(html);
        $('#chat').append('<div class="alert alert-danger"><b>'+data.user+'</b> left the chat</div>')
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
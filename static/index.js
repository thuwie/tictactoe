const url = 'http://localhost:3000/api';
$(function () {
    const socket = io();
    $('form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('message', $('#m').val());
        $('#m').val('');
        return false;
    });

    //create room
    $('#createRoom').click(async () => {
        try {
            const result = await axios.get(`${url}/createRoom`);
            window.location.replace(window.location.href + result.data);
        } catch (err) {
            console.log(err);
        }
    });

    const list = $('#rooms');
    const parent = list.parent;
    socket.on('roomsList', function (msg) {
        console.log(msg);
        const {rooms} = msg;
        $('#rooms').text('');
        $.each(rooms, function (index, value) {
            const roomName = `<td width="50%">Room ID: [${value.roomId}]</td>`;
            const roomStatus = `<td width="30%">Status: [${value.roomStatus}]</td>`;
            const roomJoinButton = `<td width="20%"><button id=${value.roomId}>Join room</button></td>`;
            const roomText = `${roomName} ${roomStatus}`;

            const element = `<li><table><tr>${roomText} ${roomJoinButton}</tr></table></li>`;
            $("#rooms").append(element);
        });
    });
});
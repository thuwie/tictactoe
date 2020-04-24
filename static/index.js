const url = 'http://localhost:3000/api';
function getStatus(status) {
    switch (status) {
        case 0:
            return 'Waiting for the opponent';
        case 1:
            return 'Preparing';
        case 2:
            return 'In game';
        case 3:
            return 'Finished';
    }
}
async function createRoom() {
    try {
        const result = await axios.get(`${url}/createRoom`);
        window.location.replace(window.location.href + result.data);
    } catch (err) {
        console.log(err);
    }
}
async function joinGame(element) {
    const { id } = element;
    console.log(id);
    window.location.replace(window.location.href + `game.html?id=${id}`);
}

$(function () {
    const socket = io();
    $('form').submit(function (e) {
        e.preventDefault(); // prevents page reloading
        socket.emit('message', $('#m').val());
        $('#m').val('');
        return false;
    });

    //create room
    $('#createRoom').click(createRoom);

    const list = $('#rooms');
    const parent = list.parent;

    socket.on('roomsList', function (msg) {
        console.log(msg);
        const {rooms} = msg;
        $('#rooms').text('');
        $.each(rooms, function (index, value) {
            const roomName = `<td width="50%">Room ID: [${value.roomId}]</td>`;
            const roomStatus = `<td width="30%">Status: [${getStatus(value.roomStatus)}]</td>`;
            const roomJoinButton = `<td width="20%"><button onClick='joinGame(this)' id=${value.roomId}>Join room</button></td>`;
            const roomText = `${roomName} ${roomStatus}`;

            const element = `<li><table><tr>${roomText} ${roomJoinButton}</tr></table></li>`;
            $("#rooms").append(element);
        });
    });
});
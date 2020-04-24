const url = 'http://localhost:3000/api';

$(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('id');
    const socket = io();

    $('#title').text(`Game ${roomId}`);
    socketSendJoinMessage(socket, roomId);
    onSocketUpdate(socket);
    drawTable();
});

function socketSendJoinMessage(socket, roomId) {
    socket.on('connect', () => {
        socket.emit('joinRoom', {playerId: socket.id, roomId});
    });
}

function toSocketUpdate() {

}

function onSocketUpdate(socket) {
    socket.on('playerJoined', (message) => {
        console.log(message);
        $('#players').text(message);
    });
}

function drawTable() {
    $('#playfield').text('');

    $('#playfield').append(drawField(3));
}

function drawField(n, big, nested) {
    let table = '<table class="gameTable">';
    for (let i = 1; i < n+1; i++) {
        table += '<tr>';
        for (let j = 0; j < n; j++) {
            if (nested) {
                const id = big + '.' + (n * (i-1) + j + 1);
                table += `<td class="activeZone" id="${id}">${id}</td>`
            } else {
                table += `<td>${drawField(3, (n * (i-1) + j + 1), true)}</td>`;
            }

        }
        table += '</tr>';
    }
    table += '</table>';
    return table;
}


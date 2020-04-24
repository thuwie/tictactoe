const url = 'http://localhost:3000/api';

$(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const roomId = urlParams.get('id');
  const socket = io();

  $('#title').text(`Game ${roomId}`);
  socketSendJoinMessage(socket, roomId);
  onSocketUpdate(socket);
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

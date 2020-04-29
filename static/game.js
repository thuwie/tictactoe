const url = 'http://quizzup.ru/api';
let socket;
let roomId;
$(function () {
    const urlParams = new URLSearchParams(window.location.search);
    roomId = urlParams.get('id');
    socket = io();

    $('#title').text(`Game ${roomId}`);
    socketSendJoinMessage(socket, roomId);
    setSocketListeners(socket);
    drawTable();
    activateBig(5);
});

function socketSendJoinMessage(socket, roomId) {
    socket.on('connect', () => {
        socket.emit('joinRoom', {playerId: socket.id, roomId});
    });
}

function setSocketListeners(socket) {
    socket.on('playersChanged', (message) => {
        $('#players').text(message);
    });
    socket.on('getTurn', (message) => {
        const {win, activePlayer, playfield, big, turnsCount} = message;

        $('#turns').text(`${activePlayer}'s turn. Turn #${turnsCount}`);
        if (activePlayer !== socket.id) {
            changeActiveBig(-1);
        } else {
            // TODO change big value send from the backend
            changeActiveBig(Number.parseInt(big));
        }
        updateField(playfield);
    });
    socket.on('endgame', (message) => {
        const {win, activePlayer, playfield, turnsCount} = message;

        $('#turns').text(`${activePlayer} wins at the turn ${turnsCount}! Congratulations!`);
        updateField(playfield);
        changeActiveBig(-1);
    })
}

function activeClick(element) {
    if (($(element).hasClass('unselectable'))) return;

    $(element).text('•');
    disactivateElement(element);
    const [big, short] = element.id.split('_');
    socket.emit('sendTurn', {playerId: socket.id, roomId, turn: {big, short}});
}

function drawTable() {
    $('#playfield').text('');
    $('#playfield').append(drawField(3));
}

function drawField(n, big, nested) {
    let table = '<table class="gameTable">';
    for (let i = 1; i < n + 1; i++) {
        table += '<tr>';
        for (let j = 0; j < n; j++) {
            const nestedId = n * (i - 1) + j + 1;
            if (nested) {
                // const id = `${big}_${(n * (i-1) + j + 1)}`;
                const id = '' + big + '_' + nestedId;
                table += `<td class="activeZone unselectable" onClick='activeClick(this)' id="${id}"></td>`
            } else {
                table += `<td>${drawField(3, nestedId, true)}</td>`;
            }

        }
        table += '</tr>';
    }
    table += '</table>';
    return table;
}

function activateBig(big) {
    for (let i = 1; i < 10; i++) {
        $(`#${big}_${i}`).removeClass('unselectable');
        $(`#${big}_${i}`).addClass('selectable');
    }
}

function disactivateBig(big) {
    for (let i = 1; i < 10; i++) {
        $(`#${big}_${i}`).addClass('unselectable');
        $(`#${big}_${i}`).removeClass('selectable');
    }
}

function disactivateElement(element) {
    $(element).addClass('unselectable marked');
}

function changeActiveBig(big) {
    for (let i = 1; i < 10; i++) {
        if (i === big) {
            activateBig(i);
        } else {
            disactivateBig(i);
        }
    }
}

//TODO very ineffective such govnokod
function updateField(playfield) {
    Object.entries(playfield).forEach(([bigIndex, big]) => {
        Object.entries(big).forEach(([shortIndex, shortPlayer]) => {
            let symbol = '';
            if (shortPlayer === 1) symbol = 'X';
            if (shortPlayer === 2) symbol = 'O';
            $(`#${bigIndex}_${shortIndex}`).text(symbol);
        })
    })
}


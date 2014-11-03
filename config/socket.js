module.exports = function (server) {

    var io = require('socket.io').listen(server);

    var ch =  require('chess.js');

    /*
     * live show of top rated game
     */
    var trg = new ch.Chess();

    var tv = io.of('/tv');

    setInterval(function() {
        var possibleMoves = trg.moves();
        // if the game is over, reload a new game
        if (trg.game_over() === true || trg.in_draw() === true || possibleMoves.length === 0) {
            trg = new ch.Chess();
            possibleMoves = trg.moves();
        }

        var m = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        trg.move(m);
        tv.emit('newTrgMove', { fen: trg.fen(), pgn: trg.pgn(), turn: trg.turn() });
    }, 3000);

    tv.on('connection', function(socket){
        socket.emit('newTrgMove', { fen: trg.fen(), pgn: trg.pgn(), turn: trg.turn() });
    });
    //end live show of top rated game

    var games = {};
    var users = 0;

    var monitor = io.of('/monitor');
    monitor.on('connection', function(socket){
        socket.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
    });

    io.sockets.on('connection', function (socket) {

        var username = socket.handshake.query.user;

        users++;
        monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});

        socket.on('join', function (data) {
            var room = data.token;

            if (!(room in games)) {
                var players = [{
                    socket: socket,
                    name: username,
                    status: 'joined',
                    side: data.side
                }, {
                    socket: null,
                    name: "",
                    status: 'open',
                    side: data.side === "black" ? "white" : "black"
                }];
                games[room] = {
                    room: room,
                    creator: socket,
                    status: 'waiting',
                    creationDate: Date.now(),
                    players: players
                };

                socket.join(room);
                socket.emit('wait');
                return;
            }

            var game = games[room];

            /* todo: handle full case
            if (game.status === "ready") {
                socket.emit('full');
            }*/

            socket.join(room);
            game.players[1].socket = socket;
            game.players[1].name = username;
            game.players[1].status = "joined";
            game.status = "ready";
            io.sockets.to(room).emit('ready', { white: getPlayerName(room, "white"), black: getPlayerName(room, "black") });

        });

        socket.on('new-move', function(data) {
            socket.broadcast.to(data.token).emit('new-move', data);
        });

        socket.on('resign', function (data) {
            var room = data.token;
            if (room in games) {
                io.sockets.to(room).emit('player-resigned', {
                    'side': data.side
                });
                games[room].players[0].socket.leave(room);
                games[room].players[1].socket.leave(room);
                delete games[room];
                monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
            }
        });

        socket.on('disconnect', function(data){
            users--;
            monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
            for (var token in games) {
                var game = games[token];
                for (var p in game.players) {
                    var player = game.players[p];
                    if (player.socket === socket) {
                        socket.broadcast.to(token).emit('opponent-disconnected');
                        delete games[token];
                        monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
                    }
                }
            }
        });

    });

    function getPlayerName(room, side) {
        var game = games[room];
        for (var p in game.players) {
            var player = game.players[p];
            if (player.side === side) {
                return player.name;
            }
        }
    }

};
module.exports = function (server) {

    var io = require('socket.io').listen(server);

    var chess =  require('chess.js');

    /*
     * live show of top rated game
     */
    var topRatedGame = new chess.Chess(); // fake game (playing random moves). It should be a real game being played on the server

    var tv = io.of('/tv'); // Socket to broadcast top rated game moves to index and tv pages

    setInterval(function() {
        var possibleMoves = topRatedGame.moves();
        // if the game is over, reload a new game
        if (topRatedGame.game_over() === true || topRatedGame.in_draw() === true || possibleMoves.length === 0) {
            topRatedGame = new chess.Chess();
            possibleMoves = topRatedGame.moves();
        }

        var move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        topRatedGame.move(move);
        tv.emit('new-top-rated-game-move', { fen: topRatedGame.fen(), pgn: topRatedGame.pgn(), turn: topRatedGame.turn() });
    }, 3000);

    tv.on('connection', function(socket){
        socket.emit('new-top-rated-game-move', { fen: topRatedGame.fen(), pgn: topRatedGame.pgn(), turn: topRatedGame.turn() });
    });
    /*
     * End of live show of top rated game
     */

    var games = {};
    var users = 0;

    /*
     * Socket to use to broadcast monitoring events
     */
    var monitor = io.of('/monitor');
    monitor.on('connection', function(socket){
        socket.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});
    });

    /*
     * Socket IO event handlers
     */
    io.sockets.on('connection', function (socket) {

        var username = socket.handshake.query.user;

        users++;
        monitor.emit('update', {nbUsers: users, nbGames: Object.keys(games).length});

        /*
         * A player joins a game
         */
        socket.on('join', function (data) {
            var room = data.token;

            // If the player is the first to join, initialize the game and players array
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
                socket.emit('wait'); // tell the game creator to wait until a opponent joins the game
                return;
            }

            var game = games[room];

            /* TODO: handle full case, a third player attempts to join the game after already 2 players has joined the game
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

        /*
         * A player makes a new move => broadcast that move to the opponent
         */
        socket.on('new-move', function(data) {
            socket.broadcast.to(data.token).emit('new-move', data);
        });

        /*
         * A player resigns => notify opponent, leave game room and delete the game
         */
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

        /*
         * A player disconnects => notify opponent, leave game room and delete the game
         */
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

    /*
     * Utility function to find the player name of a given side.
     */
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
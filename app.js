var express = require('express')
  , http = require('http')
  , path = require('path')
  , imdb = require('./imdb.js')
  , app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Setup routes
app.get('/game/start/', function (req, res) {
    if (!imdb.ready) {
        return res.json(false);
    } else {
        imdb.setupRounds();
        start = true;
        return res.json(true);
    }
});
app.get('/game/stop/', function (req, res) {
    start = false;
    imdb.clearRounds();
    round = 1;
});
app.get('/get/question/:round', function (req, res) {
    var roundNumber = req.params.round;
    var round = getRound(roundNumber);

    console.log('Round #' + roundNumber + ' question: ' + round.title);

    return res.json(round.title);
});
app.get('/get/answer/:player/:round/:answer', function (req, res) {
    var roundNumber = req.params.round;
    var answer = req.params.answer;
    var round = getRound(roundNumber);

    console.log('Round #' + roundNumber + ' answer: ' + round.year);

    if (answer == round.year) {
        return res.json(true);
    } else {
        return res.json(false);
    }
});

// socket.io initialization
var server = http.createServer(app).listen(3000);
var io = require('socket.io').listen(server);

// Helper functions
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

getRound = function(roundNumber) {
    for(var i in imdb.rounds){
        if (imdb.rounds[i].number == roundNumber) {
           return imdb.rounds[i];
        }
    }
    return null;
};

// Game logic
var players = {},
    start = false,
    round = 1;

// Initialize our IMDb movie list
imdb.getTop250();

io.sockets.on('connection', function (socket) {
    socket.on('addPlayer', function(player) {
        players[socket.id] = player;
        players[socket.id].id = socket.id;
        console.log("Player " + player.userName + " with id: " + socket.id + " has joined.");
        for (var key in players) {
            console.log("Players: " + key + " : " + players[key].userName);
        }
        if (Object.size(players) == 2) {
            io.sockets.emit('ready', true);
        }

        socket.emit('playerId', socket.id);
    });

    socket.on('logPoints', function(player) {
        if (players[socket.id] != null) {
            players[socket.id].score = player.score;
            console.log(players[socket.id].userName + ' score: ' + players[socket.id].score);
        }
    });

    socket.on('answerQuestion', function (roundNumber) {
        round = roundNumber;
        var imdbRound = getRound(roundNumber);
        imdbRound.answers++;

        if (imdbRound.answers >= 2) {
            if (round < 8) {
                // Move on to the next round
                io.sockets.emit('nextRound', true);
            } else {
                // Game over!
                console.log('Game over!');
                console.log(players);
                io.sockets.emit('gameOver', players);
            }
        }
    });

    socket.on('disconnect', function() {
        if (players[socket.id] != null) {
            start = false;
            imdb.clearRounds();
            round = 1;
            console.log("Player " + players[socket.id].userName + " with id: " + socket.id + " has left.");
            io.sockets.emit('playerLeft', players[socket.id]);
            delete players[socket.id];

            for (var key in players) {
                console.log("Remaining players: " + key + " : " + players[key].userName);
            }
            if (Object.size(players) < 2) {
                io.sockets.emit('ready', false);
            }
        }
    });
});
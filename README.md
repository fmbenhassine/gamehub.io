# About GameHub.io
[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/benas/gamehub.io?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

GameHub.io is an attempt to make a real-time multi player gaming server using the following technologies:

### Client side

* HTML5, CSS3, <a href="http://getbootstrap.com/" target="_blank">Twitter bootstrap</a> and <a href="http://fortawesome.github.io/Font-Awesome/" target="_blank">Font awesome</a> to make a nice looking UI
* <a href="http://jquery.com/" target="_blank">JQuery</a> combined with the inevitable Javascript utilities (<a href="https://lodash.com/" target="_blank">Lodash</a>, <a href="http://momentjs.com/" target="_blank">Moment.js</a>, <a href="http://github.hubspot.com/messenger/" target="_blank">Messenger.js</a> and <a href="http://www.highcharts.com/" target="_blank">Highcharts</a>) for client side logic
* <a href="http://socket.io/" target="_blank">Socket.io</a> client to make real time gaming possible

### Server side

* <a href="http://nodejs.org/" target="_blank">Node JS</a> as web server
* <a href="http://expressjs.com/" target="_blank">Express JS</a> as web framework
* <a href="http://passportjs.org/" target="_blank">Passport JS</a> as authentication middleware
* <a href="http://socket.io/" target="_blank">Socket.io</a> server to make real time gaming possible
* <a href="http://handlebarsjs.com/" target="_blank">Handlebars.js</a> to easily render HTML templates
* <a href="http://www.mongodb.org/" target="_blank">Mongo DB</a> along with <a href="http://mongoosejs.com/" target="_blank">Mongoose</a>
* <a href="http://www.elasticsearch.org/" target="_blank">ElasticSearch</a> server for (near) real time game indexing and lookup</a>

# Goals

The main goal of GameHub.io is to provide a non trivial web application serving as an example of gaming server using the aforementioned technologies.

Here is a list of core features:

* Application structure and setup
* User authentication and registration process (/login & /register)
* Real time multi player gaming logic (See gaming logic section)
* RESTful API (/api)
* Real time monitoring dashboard (/monitor)
* "TV" page to broadcast any real time content (/tv)
* Real time game indexing and searching using ElasticSearch (/search)

# Architecture

![architecture](https://github.com/benas/gamehub.io/raw/master/site/gamehub.jpg)

# Gaming logic

GameHub.io uses a simple gaming sequence through Socket.io that works for 2+ players. Here is a simplified diagram of most relevant events:

![gamehub.io](https://github.com/benas/gamehub.io/raw/master/site/chesshub-sequence-diagram.jpg)

1. Each player can create a game by sending a 'create-game' event to the server
2. The server creates a new game and replies to the player with a randomly generated token for the game
3. The player sends this token to other players and waits for them to join the game
4. Others players join the game by sending a 'join-game' event to the server
5. Once all players joined the game, the server joins players sockets to the same socket.io room
6. At this point, the game starts: depending on the game nature, each player can send a random number of events that will be broadcast to other players.
7. When the game is over, each player is notified and sockets leave the game room

# Use case: ChessHub.io

### Introduction

ChessHub.io is a real time multi player chess server that serves as a sample of how to reuse GameHub.io core features.

The goal of ChessHub.io is not to provide a fully featured web application to play chess online.

Even though the application is related to chess, it is easy to change the domain model along with application logic and keep/adapt the application structure.

### Why Chess?

* Because it is a good use case for real time multi player gaming
* Because every time you look for a real time application example on the web, you end up on chat applications, so I decided to change the landscape :-)
* Because I am a chess junkie!

### Credits

Chess logic on the client side uses the excellent <a href="https://github.com/jhlywa/chess.js" target="_blank">Chess.js</a> and <a href="http://chessboardjs.com/" target="_blank">Chessboard.js</a> libraries.

### Live demo

[http://chesshub-benas.rhcloud.com/](http://chesshub-benas.rhcloud.com/)

### Build and Run the application

#### Prerequisites

* Node JS
* Mongo DB up and running on the default port (27017) and using the default database (test)
* ElasticSearch server up and running on the default port (9200)

#### Run the application

```
$> npm install
$> node initData.js
$> node .
```

Browse the following address: `http://localhost:3000`

You can register a new account or sign in with the following credentials: foo@bar.org / foobar

Note: `The initData.js` script will populate Mongo DB and ElasticSearch with some data so you can use the application.

#### Screen shots

###### Home page

![home](https://github.com/benas/gamehub.io/raw/master/site/home.jpg)

###### Playing chess in real time

![play](https://github.com/benas/gamehub.io/raw/master/site/play.jpg)

###### Watch live game

![tv](https://github.com/benas/gamehub.io/raw/master/site/tv.jpg)

###### Search a game

![search](https://github.com/benas/gamehub.io/raw/master/site/search.jpg)

###### Real time monitoring dashboard

![monitor](https://github.com/benas/gamehub.io/raw/master/site/monitor.jpg)

#### RESTful API

##### User details: GET /api/user/:name

Example: /api/user/Foo

```json
{
    "id": "54564692985517c304587d01",
    "name": "Foo",
    "email": "foo@bar.org",
    "lastConnection": "2014-12-02T23:50:59.218Z"
}
```

##### Game details: GET /api/game/:id

Example: /api/game/5456476066be11c704942161

```json
{
    "id":"5456476066be11c704942161",
    "user":"54564692985517c304587d01",
    "white":"Foo",
    "black":"Anonymous",
    "pgn":"1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. O-O Bc5 5. c3 O-O 6. d4 exd4 7. cxd4 Bb4",
    "result":"1-0"
}
```

# Contribution

There are probably some points of improvement in the application design, structure or code.

If you believe there is a best practice I have not followed, please let me know by opening an issue on the issue tracker. Pull requests are welcome!

# License

GameHub.io is released under the [MIT license](http://opensource.org/licenses/MIT):

```
The MIT License (MIT)

Copyright (c) 2014 Mahmoud Ben Hassine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

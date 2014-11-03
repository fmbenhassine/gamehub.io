# About ChessHub.io

ChessHub.io is an attempt to make a non trivial real-time multiplayer gaming web application using the following technologies:

## Client side

* HTML5, CSS3, <a href="http://getbootstrap.com/" target="_blank">Twitter bootstrap</a> and <a href="http://fortawesome.github.io/Font-Awesome/" target="_blank">Font awesome</a> to make a nice looking UI
* <a href="http://jquery.com/" target="_blank">JQuery</a> combined with the inevitable Javascript utilities (<a href="https://lodash.com/" target="_blank">Lodash</a>, <a href="http://momentjs.com/" target="_blank">Moment.js</a>, <a href="http://github.hubspot.com/messenger/" target="_blank">Messenger.js</a> and <a href="http://www.highcharts.com/" target="_blank">Highcharts</a>) for client side logic
* <a href="http://socket.io/" target="_blank">Socket.io</a> client to make real time gaming possible
* <a href="https://github.com/jhlywa/chess.js" target="_blank">Chess.js</a> and <a href="http://chessboardjs.com/" target="_blank">Chessboard.js</a> for everything related to chess

## Server side

* <a href="http://nodejs.org/" target="_blank">Node JS</a> as Web server
* <a href="http://expressjs.com/" target="_blank">Express JS</a> as Web framework
* <a href="http://passportjs.org/" target="_blank">Passport JS</a> as authentication middleware
* <a href="http://socket.io/" target="_blank">Socket.io</a> server to make real time gaming possible
* <a href="http://handlebarsjs.com/" target="_blank">Handlebars.js</a> to easily render HTML templates
* <a href="http://www.mongodb.org/" target="_blank">Mongo DB</a> along with <a href="http://mongoosejs.com/" target="_blank">Mongoose</a>

# Why Chess?

* Because it is a good use case for real-time multiplayer gaming
* Because every time you look for a real-time application example on the web, you end up on chat applications, so I decided to change the subject :-)
* Because I am a chess junkie!

# Goals

The goal of ChessHub.io is not to provide a fully featured web application to play chess but to provide a non trivial
application serving as an example of modern web application using the aforementioned technologies.

Apart from chess logic, here is a list of reusable features:

* Application structure and setup
* User authentication and registration process (/login & /register)
* Real time multiplayer gaming logic (See gaming logic section)
* RESTful API (/api)
* Real time monitoring dashboard (/monitor)
* "TV" page to broadcast any real-time content (/tv)

Even though the application is related to chess, it is easy to change the domain model along with application logic and keep/adapt the application structure.

# Gaming logic

ChessHub.io uses a simple gaming sequence through Socket.io that works for 2+ players. Here is a simplified diagram of most relevant events:

![chesshub.io](https://github.com/benas/chesshub.io/raw/master/site/chesshub-sequence-diagram.jpg)

# Build and Run the application

## Prerequisites

* Node JS
* Mongo DB up and running on the default port (27017) and using the default database (test)

## Run the application

```
$> npm install
$> node initData.js
$> node .
```

Browse the following address: `http://localhost:3000`

You can register a new account or sign in with the following credentials: foo@bar.org / foobar

Note: `The initData.js` script will populate Mongo DB with some data so you can use the application.

# Screen shots

### Home page

![home](https://github.com/benas/chesshub.io/raw/master/site/home.jpg)

### Playing chess in real time

![play](https://github.com/benas/chesshub.io/raw/master/site/play.jpg)

### Watch live game

![tv](https://github.com/benas/chesshub.io/raw/master/site/tv.jpg)

### Real time monitoring dashboard

![monitor](https://github.com/benas/chesshub.io/raw/master/site/monitor.jpg)

# Contribution

I made ChessHub.io primarily to learn how to make this kind of real-time applications with a non hello world use case.

I am aware of the excellent <a href="http://mean.io" target="_blank">MEAN.io</a> project, but I decided to go from the ground up without code generation to understand how things work behind the scene.

I am not an expert in all these technologies, so there are probably some points of improvement in the application design, structure or code.

If you believe there is best practice I have not followed, please let me know by opening an issue on the issue tracker. Pull requests are welcome!

# License

ChessHub.io is released under the MIT license (see LICENSE file).
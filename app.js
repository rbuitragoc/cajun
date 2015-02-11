var Collabot = require("./classes/Collabot.class");
var config = require("./config");
var collabot = new Collabot(config);

var express = require('express');

var app = express();

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
});

app.post('/', function (req, res) {
	collabot.start(); 
  	res.send('Bot starting...');
});
app.use(express.static(__dirname + '/public'));
app.listen(3000);
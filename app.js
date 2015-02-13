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

app.post('/start', function (req, res) {
	collabot = new Collabot(config);
	collabot.start(function(status){
		res.send(status);
	});
});
app.post('/stop', function (req, res) {
	collabot.stop(function(status){
		res.send(status);
	}); 
  	
});
app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || 3000);
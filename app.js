var Collabot = require("./classes/Collabot.class");
var config = require("./config");
var collabot = null;

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
	if(collabot == null) {
		console.log("Starting Collabot...");
		collabot = new Collabot(config);		
		collabot.start(function(status){
			res.send(status);
		});
	} else {
		res.send("already started");
	}
});
app.post('/stop', function (req, res) {
	if(collabot){
		console.log("Stopping Collabot...");
		collabot.stop(function(status){
			res.send(status);
		});		
		collabot = null;
	} else {		
		res.send("already stopped");
	}
});
app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || 3000);
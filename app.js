var fs = require('fs')
var Cajunbot = require("./classes/Cajunbot.class");
var config = require("./config");
var cajunbot = null;

var express = require('express');

var app = express();

var startBot = function(res) {
	if (res || config.debug) {
		console.log("Starting Cajunbot...");
		cajunbot = new Cajunbot(config);		
		cajunbot.start(function(status) {
			if (res) res.send(status);
			console.log("Status: %s", status)
		});
	}
}

app.set('views', './views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  res.render('home', {
    title: 'Welcome'
  });
});

app.get('/config.js', function(req, res) {
    res.setHeader('content-type', 'text/javascript');
    res.write("var appUrls = {start: '"+config.appUrls.start+"', stop: '"+config.appUrls.stop+"'};");
    res.end();
});

app.get('/edserv/ratedtrainings/:reportfilename', function(req, res){
	var fileName = req.params.reportfilename
	console.log("Trying to retrieve file %s ...", fileName)
	// This version uses fs and then send(Buffer) ...
	/*var file = fs.readFile(fileName, function(err, data) {
		if (err) {
			console.error(err)
			res.status(500).send("Can't read file!")
		} else {
			if (data) { 
				console.log("Read the file %s! Here the contents: \n%s", fileName, data)
				res.status(200).send(new Buffer(data))
			} else {
				console.error("File %s not found", fileName)
				res.status(404).send("File not found")
			}
		}
	})*/
	// Although I preferred newer express sendFile api which elegantly wraps fs :)
	var options = {
		root: './',
		dotfiles: 'deny',
		headers: {
			'x-timestamp': Date.now(),
			'x-sent': true
		}
	}
	res.sendFile(fileName, options, function (err) {
		if (err) {
			console.error("Can't open this file %s: %s", fileName, err)
			res.status(err.status).end()
		} else {
			console.log("Sent file %s!", fileName)
		}
	})
})

app.post('/start', function (req, res) {
	if(cajunbot == null) {
		startBot(res)
	} else {
		res.send("already started");
	}
});
app.post('/stop', function (req, res) {
	if(cajunbot){
		console.log("Stopping Cajunbot...");
		cajunbot.stop(function(status){
			res.send(status);
		});		
		cajunbot = null;
	} else {		
		res.send("already stopped");
	}
});
app.use(express.static(__dirname + '/public'));
app.listen(process.env.PORT || 3000, startBot());

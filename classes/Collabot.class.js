function Collabot(config){
	this.version = "0.1";
	this.config = config;
	this.connector = new config.connector(config);
	this.persistence = new config.persistence(config);
}

module.exports = Collabot;

var CollaborationManager = require('./CollaborationManager.class');
var async = require('async');

Collabot.prototype = {
	start: function(){
		this.persistence.init();
		this.connector.init(this);
		this.collaborationManager = new CollaborationManager();
	},
	channelJoined: function(channel, who){
		
	},
	message: function(from, text){
		try {
			if (!text)
				return;
			if (text.indexOf("bot") == 0){
				if (text.indexOf("give") > -1){
					this._give(from, text);
				} else if (text.indexOf("about") > -1){
					this._about(from);
				} else if (text.indexOf("help") > -1){
					this._help(from);
				} else if (text.indexOf("joke") > -1){
					this._joke();
				} else	if (text.indexOf("creator") > -1){
					this._creator();
				}else {
					this._wtf(from);
				}	
			}
		} catch (err){
			this.share('Whoopsie! '+err);
			console.log(err.stack);
		}
	},
	_give: function (from, text){
		var command = /give (\d+) points to (\w+)$/.exec(text);
		if (!command || !command.length || !command.length == 3){
			this.share("Sorry, I didn't understand that..");
			return;
		}
		var points = command[1];
		var target = command[2];
		if (!points || !target){
			this.share("Sorry, I didn't understand that..");
			return;
		}
		var updateScoreRequest = {
			fromPlayerName: from,
			toPlayerName: target,
			collabPoints: parseInt(points),
			channel: this.connector.slackChannel.name
		}
		console.log("updateScoreRequest:");
		console.log(updateScoreRequest)
		this.collaborationManager.givePoints(updateScoreRequest, this);
	},
	_about: function (){
		this.share("I am Collabot version "+this.version+". I'm running on "+this.config.environment+" using the "+this.connector.name+" interactivity connector and the "+this.persistence.name+" persistance connector.");
	},
	_joke: function(){
		this.share("This is no time for jokes, my friend.");
	},
	_creator: function(){
		this.share("I am being created by VP karmabot dev team.");
	},
	_wtf: function(who){
		this.share("Perhaps you need to rephrase... ");
	},
	_help: function (who){
		this.say(who, "[bot give] Gives a player X points. Example: 'bot give 5 points to slash'.");
		this.say(who, "[bot about] Gets some information about the karmabot.");
	},
	say: function(who, text){
		this.connector.say(who, text);
	},
	share: function(text){
		this.connector.share(text);
	},
	registerPlayers: function(players){
		console.log("registering players...");
		console.log(players);
		var that = this;	

		async.each(players, 

			function (player){
				that.persistence.getPlayerByName(player, function(user, err){
					if(err){
						console.log("error getting player");
						console.error(err);
					} else if(!user){
						console.log("new Player: ");
						console.log(player);
						that.persistence.insertNewPlayer(player, function(inserted, err){
							if(err){
								console.log(err.stack);
							} else {
								console.log("player inserted: ");
								console.log(inserted);
							}
						});
					}
				});
			},

			function(err){console.error(err);});		
	}
}
function Collabot(config){
	this.version = "1.0";
	this.config = config;
	this.connector = new config.connector(config);
	this.persistence = new config.persistence(config);
}

module.exports = Collabot;

var CollaborationManager = require('./CollaborationManager.class');
var async = require('async');
var mentionCheck = require('./util/ChatUtils.class');

Collabot.prototype = {
	start: function(){
		this.persistence.init();
		this.connector.init(this);
		this.collaborationManager = new CollaborationManager();
	},
	channelJoined: function(channel, who){
		
	},
	message: function(from, text){
		var wasMentioned = mentionCheck(this.config.botName, text)
		try {
			if (!text)
				return;
			if (wasMentioned){
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
				} else	if (text.indexOf("top") > -1){
					this._top();
				} else if (text.toLowerCase().indexOf("how am i") > -1){
					this._howAmIDoing(from);
				} else {
					this._wtf(from);
				}	
			}
		} catch (err){
			this.share('Whoopsie! '+err);
			console.log(err.stack);
		}
	},
	_give: function (from, text){
		var command = /give (\d+) points to (.+)$/.exec(text);
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
			channel: this.connector.slackChannel.name,
			maxCollabPoints : this.config.maxCollabPoints
		}
		console.log("updateScoreRequest:");
		console.log(updateScoreRequest)
		this.collaborationManager.givePoints(updateScoreRequest, this);
	},
	_top: function(){
		this.collaborationManager.topTen(this);
	},
	_howAmIDoing: function (from){
		this.collaborationManager.tellStatusTo(from, this);
	},
	_about: function (){
		this.share("I am " + this.config.botName + " version "+this.version+". I'm running on "+this.config.environment+" using the "+this.connector.name+" interactivity connector and the "+this.persistence.name+" persistance connector.");
	},
	_joke: function(){
		this.share("This is no time for jokes, my friend.");
	},
	_creator: function(){
		this.share("I am being created by VP Gambit dev team.");
	},
	_wtf: function(who){
		this.share("Perhaps you need to rephrase... ");
	},
	_help: function (who){
		this.say(who, "["+this.config.botName+" give] Gives a player X points. Example: 'bot give 5 points to slash'.");
		this.say(who, "["+this.config.botName+" about] Gets some information about the collabot.");
		this.say(who, "["+this.config.botName+" how am i] Tells you your overall, daily, weekly and last week scores.");
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
			function(player){that.registerPlayer(player);},
			function(err){
				console.error(err);
			});		
	},
	registerPlayer: function(player){
		console.log("attempting to register player: " + player);		
		var that = this;
		that.persistence.getPlayerByName(player, function(user, err){
			if(err){
				console.log("error getting player");
				console.error(err);
			} else if(!user){
				console.log("new Player: " + player);				
				that.persistence.insertNewPlayer(player, function(inserted, err){
					if(err){
						console.log(err.stack);
					} else {
						console.log("player inserted: ");
						console.log(inserted);
					}
				});
			} else {
				console.log(user + " already exists.");
			}
		});		
	}
}
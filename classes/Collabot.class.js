function Collabot(config){
	this.version = "0.1";
	this.config = config;
	this.connector = new config.connector(config);
	this.persistence = new config.persistence(config);
}

module.exports = Collabot;

var CollaborationManager = require('./CollaborationManager.class');
var ConversationManager = require('./managers/ConversationManager.class');
var DefaultConversationHandler = require('./conversationHandlers/DefaultConversationHandler.class')
var async = require('async');

Collabot.prototype = {
	start: function(){
		this.persistence.init();
		this.connector.init(this);
		this.collaborationManager = new CollaborationManager();
		this.conversationManager = new ConversationManager();
		this.defaultConversationHandler = new DefaultConversationHandler(this);
	},
	channelJoined: function(channel, who){
		
	},
	message: function(from, text){
		if (!text)
			return;
		this.conversationManager.getCurrentConversations(from, function(error, conversations){
			if (error){
				console.log("Error obtaining current conversations: "+error)
				return;
			}
			for (var i = 0; i < conversations.length; i++){
				conversations[i].handle(from, text);
			}
		});
		this.defaultConversationHandler.handle(from, text);
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
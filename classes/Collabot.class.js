function Collabot(config){
	this.version = config.version;
	this.config = config;
	this.connector = new config.connector(config);
	this.persistence = new config.persistence(config);
	this.guid = null;
}

//TODO: This should be moved out of global scope
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports = Collabot;

// Managers 
var CollaborationManager = require('./CollaborationManager.class');
var ConversationManager = require('./managers/ConversationManager.class');
var TrainingSessionManager = require('./managers/TrainingSessionManager.class');

// Conversation Handlers
var DefaultConversationHandler = require('./conversationHandlers/DefaultConversationHandler.class')
var CommandConversationHandler = require('./conversationHandlers/CommandConversationHandler.class')
var GreetingConversationHandler = require('./conversationHandlers/GreetingConversationHandler.class')

// Utility Classes
var mentionCheck = require('./util/ChatUtils.class');

// External Libs
var async = require('async');

Collabot.prototype = {
	start: function(callback){
		if(this.guid){
			callback("running");
		} else {
			this.persistence.init();
			this.connector.init(this);
			this.collaborationManager = new CollaborationManager();
			this.conversationManager = new ConversationManager(this);
			this.trainingSessionManager = new TrainingSessionManager(this);
			this.commandConversationHandler = new CommandConversationHandler(this);
			this.defaultConversationHandler = new DefaultConversationHandler(this);
			this.handlers = {
				greeting: new GreetingConversationHandler(this)
			}
			this.guid = guid();
			callback("started");
		}		
	},
	stop: function(callback){
		if(this.guid){
			this.connector.logout();
			this.guid = null;
			this.persistence = null;
			this.collaborationManager = null;
			this.conversationManager = null;
			callback("stopped");
		} else {
			callback("nothing to stop")
		}		
	},
	channelJoined: function(channel, who){
		
	},
	message: function(from, text){
		try {
			if (!text)
				return;
			var wasMentioned = mentionCheck(this.config.botName, text)
			if (wasMentioned)
				this.commandConversationHandler.handle(from, text);
			this.defaultConversationHandler.handle(from, text);
			var bot = this;
			this.conversationManager.getCurrentConversations(from, function(error, conversations){
				if (error){
					console.log("Error obtaining current conversations: "+error)
					return;
				}
				try {
					for (var i = 0; i < conversations.length; i++){
						var handler = bot.handlers[conversations[i].topic];
						if (handler){
							handler.handle(from, text, conversations[i]);
						}
					}
				} catch (err){
					bot.share('Whoopsie! '+err);
					console.log(err.stack);
				}
			});
		} catch (err){
			this.share('Whoopsie! '+err);
			console.log(err.stack);
		}
	},
	say: function(who, text){
		this.connector.say(who, text);
	},
	share: function(text){
		this.connector.share(text);
	},
	registerPlayers: function(players){
		console.log("Registering players...");
		console.log(players);
		var that = this;	
		async.each(players, 
			function(player){that.registerPlayer(player);},
			function(err){
				console.error(err);
			});		
	},
	registerPlayer: function(player){
		console.log("Attempting to register player: " + player);		
		var that = this;
		that.persistence.getPlayerByName(player, function(user, err){
			if(err){
				console.log("Error getting player");
				console.error(err);
			} else if(!user){
				console.log("New Player: " + player);				
				that.persistence.insertNewPlayer(player, function(inserted, err){
					if(err){
						console.log(err.stack);
					} else {
						console.log("Player inserted: ");
						console.log(inserted);
					}
				});
			} else {
				console.log(user.name + " already exists!");
			}
		});		
	}
}

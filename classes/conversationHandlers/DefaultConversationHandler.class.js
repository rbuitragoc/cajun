var DefaultConversationHandler = function(bot){
	this.bot = bot;
}

DefaultConversationHandler.prototype = {
	handle: function (from, text){
		try {
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
				} else	if (text.indexOf("top") > -1){
					this._top();
				} else if (text.toLowerCase().indexOf("how am i") > -1){
					this._howAmIDoing(from);
				} else {
					this._wtf(from);
				}
			} else {
				if (text.indexOf("hello bot") > -1){
					var handler = this;
					this.bot.conversationManager.startConversation(from, "greeting", "waitingForMood", function(){
						handler.bot.share("Hey hello "+from+", how are you doing today?");	
					},
					function(conversation){
						// TODO: Add support to resume conversations
					});
				}
			}
		} catch (err){
			this.bot.share('Whoopsie! '+err);
			console.log(err.stack);
		}
	},
	_give: function (from, text){
		var command = /give (\d+) points to (\w+)$/.exec(text);
		if (!command || !command.length || !command.length == 3){
			this.bot.share("Sorry, I didn't understand that..");
			return;
		}
		var points = command[1];
		var target = command[2];
		if (!points || !target){
			this.bot.share("Sorry, I didn't understand that..");
			return;
		}
		var updateScoreRequest = {
			fromPlayerName: from,
			toPlayerName: target,
			collabPoints: parseInt(points),
			channel: (this.bot.connector.slackChannel ? this.bot.connector.slackChannel.name : this.bot.config.channel), //TODO: This should have no slack specific things!
			maxCollabPoints : this.bot.config.maxCollabPoints
		}
		console.log("updateScoreRequest:");
		console.log(updateScoreRequest)
		this.bot.collaborationManager.givePoints(updateScoreRequest, this.bot);
	},
	_top: function(){
		this.bot.collaborationManager.topTen(this.bot);
	},
	_howAmIDoing: function (from){
		this.bot.collaborationManager.tellStatusTo(from, this.bot);
	},
	_about: function (){
		this.bot.share("I am Collabot version "+this.bot.version+". I'm running on "+this.bot.config.environment+" using the "+this.bot.connector.name+" interactivity connector and the "+this.bot.persistence.name+" persistance connector.");
	},
	_joke: function(){
		this.bot.share("This is no time for jokes, my friend.");
	},
	_creator: function(){
		this.bot.share("I am being created by VP karmabot dev team.");
	},
	_wtf: function(who){
		this.bot.share("Perhaps you need to rephrase... ");
	},
	_help: function (who){
		this.bot.say(who, "[bot give] Gives a player X points. Example: 'bot give 5 points to slash'.");
		this.bot.say(who, "[bot about] Gets some information about the collabot.");
		this.bot.say(who, "[bot how am i] Tells you your overall, daily, weekly and last week scores.");
	},
}


module.exports = DefaultConversationHandler;
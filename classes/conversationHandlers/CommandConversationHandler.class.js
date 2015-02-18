var CommandConversationHandler = function(bot){
	this.bot = bot;
}

CommandConversationHandler.prototype = {
	handle: function (from, text){
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
			this._top(text);
		} else if (text.toLowerCase().indexOf("how am i") > -1){
			this._howAmIDoing(from);
		} else if (/authorize (.+) as presenter$/.exec(text)){
			this._autorizeAsPresenter(from, text);
		} else if(text.indexOf("create training") > -1){
			this._createTraining(from);
		} else {
			this._wtf(from);
		}
	},
	_give: function (from, text){
		var command = /give (\d+) points to (.+)$/.exec(text);
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
			channel: this.bot.connector.slackChannel.name,
			maxCollabPoints : this.bot.config.maxCollabPoints
		}
		console.log("updateScoreRequest:");
		console.log(updateScoreRequest)
		this.bot.collaborationManager.givePoints(updateScoreRequest, this.bot);
	},
	_top: function(text){
		var filters = /top( day| week| month| year)*(.+)*$/.exec(text);
		var period = null;
		var channel = null;
		if(filters){
			var filter1 = filters[1]? filters[1].trim() : null;
			var filter2 = filters[2]? filters[2].trim() : null;
			var period = filter1;
			if(!filter1 && filter2){
				if(filter2 == "day" || filter2 == "week" || filter2 == "month" || filter2 == "year" ){
					period = filter2;
				}
				else{
					channel = filter2;
				}
			}
			else{
				channel = filter2;
			}
		}
		
			
		this.bot.collaborationManager.topTen(period, channel, this.bot);
	},
	_howAmIDoing: function (from){
		this.bot.collaborationManager.tellStatusTo(from, this.bot);
	},
	_about: function (){
		this.bot.share("ID ["+this.bot.guid+"] - I am "+this.bot.config.botName+" version "+this.bot.version+". I'm running on "+this.bot.config.environment+" using the "+this.bot.connector.name+" interactivity connector and the "+this.bot.persistence.name+" persistance connector.");
	},
	_joke: function(){
		this.bot.share("This is no time for jokes, my friend.");
	},
	_creator: function(){
		this.bot.share("I am being created by VP Gambit dev team.");
	},
	_wtf: function(who){
		this.bot.share("Perhaps you need to rephrase... ");
	},
	_autorizeAsPresenter: function (from, text){
		var command = /authorize (.+) as presenter$/.exec(text);
		if (!command || !command.length || !command.length == 2){
			this.bot.share("Sorry, I didn't understand that..");
			return;
		}
		var presenter = command[1];
		if (!presenter){
			this.bot.share("Sorry, I didn't understand that..");
			return;
		}
		this.bot.trainingSessionManager.requestAuthorizationAsPresenter(from, presenter);
	},
	_help: function (who){
		this.bot.say(who, "["+this.bot.config.botName+" give] Gives a player X points. Example: 'bot give 5 points to slash'.");
		this.bot.say(who, "["+this.bot.config.botName+" about] Gets some information about the collabot.");
		this.bot.say(who, "["+this.bot.config.botName+" how am i] Tells you your overall, daily, weekly and last week scores.");
		this.bot.say(who, "["+this.bot.config.botName+" top [day|week|month|year] [channel_name]] Tells you the top ten collaborators by period and channel name. Period and Channel are optional.");
	},
	_createTraining: function(from){
		var handler = this;
		this.bot.conversationManager.startConversation(from, "createTrainingSession", "presenters", function(){
			handler.bot.say(from, "Hey "+from+", Sure!");
			handler.bot.say(from, "First we need the slack username of the presenter. Just type \"me\" if it's you.");
		},
		function(conversation){
			// TODO: Add support to resume conversations
		});
	
	}
}


module.exports = CommandConversationHandler;
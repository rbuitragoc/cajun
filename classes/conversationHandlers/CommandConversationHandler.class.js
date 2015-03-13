var CommandConversationHandler = function(bot){
	this.bot = bot;
};

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
		} else if(text.indexOf("show me upcoming sessions") > -1){
			this._showUpcomingSessions(from);
		} else if (text.toLowerCase().indexOf("create bnl session") > -1){
			this._createTraining(from);
		} else {
			this._wtf(from);
		}
	},
	_give: function (from, text){
		var command = /give (\d+) point(s{0,1}) to @{0,1}(\w+).*/.exec(text);
		if (!command || !command.length){
			this.bot.share("Sorry, I didn't understand that..");
			return;
		}
		var points = command[1];
		var target = command[3];
		var singular = command[2];

		if (!points || !target || isNaN(points)){
			this.bot.share("Sorry, I didn't understand that..");
			return;
		}
        if ((points == '1' && singular != '') ||
					(points > 1 && singular != 's') ||
					!(singular == 's' || singular == '')){
            this.bot.share("Sorry, I didn't understand one point? multiple points?");
            return;
        }
        if (from == target){
            this.bot.share("Really? are you trying to assign points to yourself? I cannot let you do that, buddy");
            return;
        }
		var updateScoreRequest = {
			fromPlayerName: from,
			toPlayerName: target,
			collabPoints: parseInt(points),
			channel: this.bot.connector.slackChannel.name,
			maxCollabPoints : this.bot.config.maxCollabPoints
		};
		console.log("updateScoreRequest:");
		console.log(updateScoreRequest);
		this.bot.collaborationManager.givePoints(updateScoreRequest, this.bot);
	},
	_top: function(text){
		var filters = /top( day| week| month| year)*(.+)*$/.exec(text);
		var period = null;
		var channel = null;
		if(filters){
			var filter1 = filters[1]? filters[1].trim() : null;
			var filter2 = filters[2]? filters[2].trim() : null;
			period = filter1;
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
		this.bot.say(who, "These are the commands I will respond to, because I'm a robot believe it or not.");
		this.bot.say(who, "["+this.bot.config.botName+" give] Gives a player X points. Example: 'bot give 5 points to slash'.");
		this.bot.say(who, "["+this.bot.config.botName+" about] Gets some information about the collabot.");
		this.bot.say(who, "["+this.bot.config.botName+" how am i] Tells you your overall, daily, weekly and last week scores.");
		this.bot.say(who, "["+this.bot.config.botName+" top [day|week|month|year] [channel_name]] Tells you the top ten collaborators by period and channel name. Period and Channel are optional.");
		this.bot.say(who, "["+this.bot.config.botName+" create BnL session] Starts a conversation to register a session");
		this.bot.say(who, "["+this.bot.config.botName+" show me upcoming sessions] Starts a conversation to enroll you in an upcoming session");
		this.bot.say(who, "Apart from these I can also tell you who attended to a training session, just ask me! (Tip: if you DM me, no need to call my name)");
	},
	_createTraining: function(from){
		var handler = this;
		this.bot.conversationManager.startConversation(from, "createTrainingSession", "presenters", function(){
			handler.bot.say(from, "Hey "+from+", Sure!");
			/*handler.bot.say(from, "First we need the slack username of the presenter. Just type \"me\" if it's you.");*/
		},
		function(conversation){
			// TODO: Add support to resume conversations
		});
	},
	_showUpcomingSessions: function(from) {
		this.bot.trainingSessionManager.initRegisterToSession(from);
	}
};

module.exports = CommandConversationHandler;

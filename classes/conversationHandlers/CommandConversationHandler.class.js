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
		} else if (text.toLowerCase().indexOf("create training session") > -1){
			this._createTraining(from);
		} else if (text.indexOf("rate session") > -1) {
			this._initRateSession(from)
		} else if (text.indexOf("copaso-url") > -1) {
			this._copaso()
		} else if (text.indexOf("test-api") > -1) {
			this._testApi(from);
		} else if (text.indexOf("list-im") > -1) {
			this._listIM(from);
		} else if (text.indexOf("hadmin") > -1) {
			this._adminOptions(from);
		} else {
			this._wtf(from);
		}
	},
	_give: function (from, text){
		var commandRegex = /give +(\d+) +point(s?) +to +(<@u[^ ]+>|[^ ]+)( +[\s\S]+)?/i,
			slackUserReferenceRegex = /<@(U[^\|]+)\|?(.*)>/i,
			slackUsrRef,
			tokens;
		tokens = commandRegex.exec(text)
		if (!tokens || (!tokens[1] || !tokens[3])){
			this.bot.share("Sorry, I didn't understand that..");
			return;
		}
		var points = tokens[1];
		var target = tokens[3];
		var reason = tokens[4];
		var singular = tokens[2];
		console.log("Well, it seems like " + from + " decided to give " + points + " points to " + target + (reason ? " because of " + reason : ''));

		// Check if the target user for the point assignment contains an at(@)
		// symbol, parse it and return the name from the slack connector obj.
		var botPointsMsg = "Great to get some love from you, " + from + ". But, as a robot, I'm based on rules, and rules say I cannot get or give points. Thanks anyway!"
		if ( !!(slackUsrRef = slackUserReferenceRegex.exec(target)) ) {
			if (!!slackUsrRef[2]) {
				target = slackUsrRef[2];
			} else {
				var slackUser = this.bot.connector.findUserById(slackUsrRef[1]);
				if (!slackUser) {
					console.error("Couldn't retrieve User info from connector with reference %s", target);
					return;
				} else {
					if (slackUser.is_bot) {
						this.bot.share(botPointsMsg);
						return;
					}
					target = slackUser.name;
				}
			}
		}
		// Check if a given player is trying to assign points to a <BOT>
		var slackUser = this.bot.connector.findUserByName(target);
		if (slackUser && slackUser.is_bot) {
			this.bot.share(botPointsMsg);
			return;
		}
		if ((points == '1' && singular != '') ||
			(points > 1 && singular != 's') || !(singular == 's' || singular == '')) {
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
			maxCollabPoints: this.bot.config.maxCollabPoints
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
		this.bot.say(who, "["+this.bot.config.botName+" give] Gives a player X points. Example: '"+this.bot.config.botName+" give 5 points to slash [because he is a cool dude]' (Yeah, you can add a reason for that, no need to use square brackets).");
		this.bot.say(who, "["+this.bot.config.botName+" about] Gets some information about the '"+this.bot.config.botName+"'");
		this.bot.say(who, "["+this.bot.config.botName+" how am i] Tells you your overall, daily, weekly and last week scores.");
		this.bot.say(who, "["+this.bot.config.botName+" top [day|week|month|year] [channel_name]] Tells you the top ten collaborators by period and channel name. Period and Channel are optional.");
		this.bot.say(who, "["+this.bot.config.botName+" create training session] Starts a conversation to register a session");
		this.bot.say(who, "["+this.bot.config.botName+" show me upcoming sessions] Starts a conversation to enroll you in an upcoming session")
		this.bot.say(who, "["+this.bot.config.botName+" rate session] Starts a conversation to rate a session you've attended")
		this.bot.say(who, "Apart from these I can also tell you who attended to a training session, just ask me!");
	},
	_createTraining: function(from){
		this.bot.trainingSessionManager.initCreateTrainingSession(from);
	},
	_showUpcomingSessions: function(from) {
		this.bot.trainingSessionManager.initRegisterToSession(from);
	},
	_initRateSession: function(from) {
		this.bot.trainingSessionManager.initRateSession(from)
	},
	_copaso: function() {
		this.bot.shareOn(this.bot.config.copaso.group, "Copaso Template: " + this.bot.config.copaso.template)
	},
	_testApi: function(who) {
		this.bot.connector._testApi(who)
	},
	_listIM: function(who) {
		this.bot.connector._listIM(who)
	},	
	_adminOptions: function(who) {
		this.bot.say(who, "These are the hidden admin commands: ");
		this.bot.say(who, "["+this.bot.config.botName+" copaso-url] Will share the URL to the COPASO template on private group "+this.bot.config.copaso.group)
		this.bot.say(who, "["+this.bot.config.botName+" test-api] will invoke Slack's 'api.test' call.")
		this.bot.say(who, "["+this.bot.config.botName+" list-im] will invoke Slack's 'im.list' call.")
	}
};

module.exports = CommandConversationHandler;

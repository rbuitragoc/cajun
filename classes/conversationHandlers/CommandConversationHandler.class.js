var StringUtils = require('../util/StringUtils.class')

var CommandConversationHandler = function(bot){
	this.bot = bot;
	this.showAttendantsRegexes = [
      /(attendants|people|person|((that|who).+(went|attended))).+(session|class|training)/
	]
};

CommandConversationHandler.prototype = {
	handle: function (from, text, channel){
		if (text.indexOf("give") > -1){
			this._give(from, text, channel);
		} else if (text.indexOf("about") > -1){
			this._about(from, channel);
		} else if (text.indexOf("help") > -1){
			this._help(from);
		} else if (text.indexOf("joke") > -1){
			this._joke(channel);
		} else	if (text.indexOf("creator") > -1){
			this._creator(channel);
		} else	if (text.indexOf("top") > -1){
			this._top(text, channel);
		} else if (text.toLowerCase().indexOf("how am i") > -1){
			this._howAmIDoing(from);
		} else if (text.indexOf("test-api") > -1) {
			this._testApi(from);
		} else if (text.indexOf("list-im") > -1) {
			this._listIM(from);
		} else if (text.indexOf("hadmin") > -1) {
			this._adminOptions(from);
		} else {
			this._wtf(from, text);
		}
	},
	_give: function (from, text, channel) {
		if (channel) {
			console.log("Someone's trying to assign points on channel %s", channel)
		}
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
						this.bot.shareOn(channel, botPointsMsg);
						return;
					}
					target = slackUser.name;
				}
			}
		}
		// Check if a given player is trying to assign points to a <BOT>
		var slackUser = this.bot.connector.findUserByName(target);
		if (slackUser && slackUser.is_bot) {
			this.bot.smartSay(channel, botPointsMsg);
			return;
		}
		if ((points == '1' && singular != '') ||
			(points > 1 && singular != 's') || !(singular == 's' || singular == '')) {
			this.bot.smartSay(channel, "Sorry, I didn't understand one point? multiple points?");
			
			return;
		}
		if (from == target) {
			this.bot.smartSay(channel, "Really? are you trying to assign points to yourself? I cannot let you do that, buddy");
			return;
		}
		var updateScoreRequest = {
			fromPlayerName: from,
			toPlayerName: target,
			collabPoints: parseInt(points),
			channel: channel,
			maxCollabPoints: this.bot.config.maxCollabPoints
		}
		console.log("updateScoreRequest:");
		console.log(updateScoreRequest)
		this.bot.collaborationManager.givePoints(updateScoreRequest, this.bot);
	},
	_top: function(text, postToChannel){
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
		
			
		this.bot.collaborationManager.topTen(period, channel, this.bot, postToChannel);
	},
	_howAmIDoing: function (from){
		this.bot.collaborationManager.tellStatusTo(from, this.bot);
	},
	_about: function (from, to){
		var message = this.bot.about()
		this.bot.smartSay(to, message)
	},
	_joke: function(to){
		this.bot.smartSay(to, "Let's make a bot look smart. Let's teach it some jokes.");
	},
	_creator: function(to){
		this.bot.smartSay(to, "I am being created by deekattax.");
	},
	_wtf: function(to, text){
		this.bot.smartSay(to, "Perhaps you need to rephrase; I couldn't understand: '"+text+"'");
	},
	_help: function (who){
		var name = this.bot.config.botName;
		this.bot.say(who, "Here's what I can do for you at the moment:");
		this.bot.say(who, "["+name+" give] Gives a player X points. Example: '"+name+" give 5 points to slash [because he is a cool dude]' (Yeah, you can add a reason for that, no need to use square brackets).");
		this.bot.say(who, "["+name+" about] Gets some information about the '"+name+"'");
		this.bot.say(who, "["+name+" how am i] Tells you your overall, daily, weekly and last week scores.");
		this.bot.say(who, "["+name+" top [day|week|month|year] [channel_name]] Tells you the top ten collaborators by period and channel name. Period and Channel are optional.");
	},
	_testApi: function(who) {
		this.bot.connector._testApi(who)
	},
	_listIM: function(who) {
		this.bot.connector._listIM(who)
	},	
	_adminOptions: function(who) {
		this.bot.say(who, "These are the hidden admin commands: ");
		this.bot.say(who, "["+this.bot.config.botName+" test-api] will invoke Slack's 'api.test' call.")
		this.bot.say(who, "["+this.bot.config.botName+" list-im] will invoke Slack's 'im.list' call.")
	},
	_prepareReport: function(who, text) {
		var bot = this.bot
		console.log("Starting conversation to generate report! ")
		bot.conversationManager.startConversation(who, "report", "fetchingTrainingSessions",
			function(conversation) {
				bot.reportManager.prepareForReport(conversation, who)
			}, function(conversation) {
			 // TODO: Add support to resume conversations
		})
	}
};

module.exports = CommandConversationHandler;

var Slack = require('slack-client');

function SlackConnector(config){
	this.name = 'SlackConnector';
	this.token = config.token;
	this.autoReconnect = config.autoReconnect;
	this.autoMark = config.autoMark;
	this.config = config;
    this.slack = null;
    this.activeUsersArray = [];
    this.bot = null;
    this.slackChannel = null;

}

SlackConnector.prototype = {
	init: function(bot){
		var that = this;
		this.bot = bot;
		console.log("Initializing with SlackConnector...");
		var slack = new Slack(this.token, this.autoReconnect, this.autoMark);
		slack.on('open', function() {
			var channelName = that.config.channel;
			var slackChannel = null;
			for (key in slack.channels) {
				console.log("Channel: "+slack.channels[key].name);
				if (/*slack.channels[key].is_member && */slack.channels[key].name === channelName) {
					slackChannel = slack.channels[key];
				}
			}
			if (slackChannel) {
				if (!slackChannel.is_member) {
					console.warn("Bot is not member of channel ["+channelName+"], can you manually add it?");
					// Error returned on channels.join: user_is_bot	(This method cannot be called by a bot user)
				}
			} else { 
				// try with groups too
				for (key in slack.groups) {
					console.log("Group: "+slack.groups[key].name)
					if (slack.groups[key].name === channelName) {
						slackChannel = slack.groups[key]
					}
				}
			}
			// Still nada? Oops!
			if (!slackChannel) {
				console.error("Error: Channel or group ["+channelName+"] not found or inaccessible")
				return
				
			} 
			
			that.slackChannel = slackChannel;
			that._registerAllMembers(slack.users);
			console.log('Welcome to Slack. You are @%s of %s', slack.self.name, slack.team.name);
			console.log('You are in: %s', channelName);
			
		});

		slack.on('message', function(message){
			if (message.type != 'message'){
				console.log("Ignoring non-message message ["+message.text+"]");				
				return;
			}
			if (message.subtype === 'channel_join'){
				var user = slack.getUserByID(message.user);
				bot.registerPlayer(user.name);	
			}
		    var user = slack.getUserByID(message.user);
		    var text = message.text;
			if (!user){
				console.log("Error: user ["+message.user+"] not found.")
				return;
			}
			bot.message(user.name, text);
		});

		slack.on('team_join', function(data){
			console.log(data);
		});

		slack.on('error', function(error) {
			console.error('Error: %s', error);
		});

		slack.login();
		this.slack = slack;
	},
	findUserById: function(userId) {
		return this.slack.getUserByID(userId);
	},
	findUserByName: function(userName) {
		return this.slack.getUserByName(userName)
	},
	logout: function(){
		console.log("Logging out as "+this.config.botName+" ID ["+this.bot.guid+"]");
		this.slack.disconnect();
		console.log(this.config.botName+" ID ["+this.bot.guid+"] successfully logged out.")
	},
	say: function(who, text){
		console.log(typeof who);
		console.log("Saying: " + text + " to " + who);
		var dm = this.slack.getDMByName(who);
		if (!dm){
			console.log('Slack can\'t find DMByName ['+who+']');
			/* @slash 090215 - Obscure bug, hard to reproduce this situation happening,
			 * seems to happen when the bot and the person have never talked.
			 * The following may work but would need to import a module from
			 * node-slack; which I doubt is doable...
			 * We'd rather submit a patch or fork it
			 * 
			 * this.slack.dms[who] = new DM(this.slack, this.users[who]);
			 * dm = this.slack.dms[who];
			 */
			return;
		}
		dm.send(text);
		
	},
	share: function(text){
		console.log("Sharing: " + text);
		this.slackChannel.send(text);
	},
	shareOn: function(text, where) {
		console.log("Trying to share '%s' on a different channel different than default: %s", text, where)
		var slackChannelOrGroup = null;
		for (key in this.slack.channels) {
			console.log("Channel: "+this.slack.channels[key].name);
			if (/*slack.channels[key].is_member && */this.slack.channels[key].name === where) {
				slackChannelOrGroup = this.slack.channels[key];
			}
		}
		if (slackChannelOrGroup) {
			if (!slackChannelOrGroup.is_member) {
				console.warn("Bot is not member of channel ["+where+"], can you manually add it?");
				// Error returned on channels.join: user_is_bot	(This method cannot be called by a bot user)
			}
		} else {
			// try with groups too
			for (key in this.slack.groups) {
				console.log("Group: "+this.slack.groups[key].name)
				if (this.slack.groups[key].name === where) {
					slackChannelOrGroup = this.slack.groups[key]
				}
			}
		}
		
		if (slackChannelOrGroup) {
			console.log("Saying '%s' on %s ", text, where)
			slackChannelOrGroup.send(text)
		}
	},
	_registerAllMembers: function (users){
		var userNamesArray = [];
		Object.keys(users).forEach(function(key){
			var value = users[key];
			userNamesArray.push(value.name);
		});			
		this.bot.registerPlayers(userNamesArray);
	}
}

module.exports = SlackConnector;
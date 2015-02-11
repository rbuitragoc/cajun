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
			if (!slackChannel){
				/*if (slack.groups[channelName].is_open && !slack.groups[channelName].is_archived) {
					slackChannel = slack.groups[channelName];
				} else { 
					console.log("Error: Channel or group ["+that.config.channel+"] not found or inaccessible by user");
					return;
				}*/
				console.log("Error: Channel ["+channelName+"] not found or inaccessible");
				return;
			} else if (!slackChannel.is_member) {
				console.log("Bot is not member of channel ["+channelName+"], joining");
				slack.joinChannel(channelName); // @slash 090215 - This does nothing.
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
	logout: function(){
		console.log("Disconnecting...");
		this.slack.disconnect();
		console.log("Disconnected.")
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
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
				// console.log("Channel: "+slack.channels[key].name);
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
					// console.log("Group: "+slack.groups[key].name)
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
			if (!user){
				console.log("Error: user ["+message.user+"] not found.")
				return;
			}
			var text = message.text;
			var raw_cgdm_obj = slack.getChannelGroupOrDMByID(message.channel);
			if (!raw_cgdm_obj) {
				console.error("Error: channel/group/DM with id [%s] does not exist", message.channel);
			} 
			// TODO I think we can use this channel object to repopulate our local cache! (not just  the names..)
			var cgdm_obj = {
				name: raw_cgdm_obj.name,
				is_group: raw_cgdm_obj.is_group,
				created: raw_cgdm_obj.created,
				creator: raw_cgdm_obj.creator,
				is_archived: raw_cgdm_obj.is_archived,
				has_pins: raw_cgdm_obj.has_pins,
				is_open: raw_cgdm_obj.is_open,
				last_read: raw_cgdm_obj.last_read,
				latest: raw_cgdm_obj.latest,
				unread_count: raw_cgdm_obj.unread_count,
				unread_count_display: raw_cgdm_obj.unread_count_display,
				members: raw_cgdm_obj.members,
				topic: raw_cgdm_obj.topic,
				purpose: raw_cgdm_obj.purpose
			}
			// console.log("Got the channel object! %s", JSON.stringify(cgdm_obj));
			// perform the actual message post to the source location!
			bot.message(user.name, text, cgdm_obj.name);
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
	say: function(who, text) {
		var slackOpts = {bot: this.bot, from: who}
		console.log(typeof who);
		console.log("Saying '%s' to: ", text, who);
		var dm = this.slack.getDMByName(who);
		if (!dm) {
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
			// Below is the fix!
			this.slack._apiCall('im.open', {user: who}, function(data) {
				handle_api_response(data, {
					call: 'im.open',
					console: JSON.stringify(data),
					msg: JSON.stringify(data.channel),
					slack: slackOpts
				})
				if (data) {
					if (data.error) {
						console.error("Error opening a DM, please tell the user to do that manually on slack, sorry: %s", data.error)
						return;
					}
					dm = this.slack.getDMByID(data.channel.id)
					if (!dm) {
						console.error("still cannot do anything to open a DM. Tell the user to do that manually on slack, sorry.")
						return;
					} else {
						dm.send(text)
					}
				}
			});
			return;
		}
		dm.send(text);
		
	},
	share: function(text){
		console.log("Sharing '%s'", text);
		this.slackChannel.send(text);
	},
	shareOn: function(place, text) {
		console.log("Trying to share '%s' on a different channel different than default: %s", text, place)
		var slackChannelOrGroup = null;
		for (key in this.slack.channels) {
			console.log("Channel: "+this.slack.channels[key].name);
			if (/*slack.channels[key].is_member && */this.slack.channels[key].name === place) {
				slackChannelOrGroup = this.slack.channels[key];
			}
		}
		if (slackChannelOrGroup) {
			if (!slackChannelOrGroup.is_member) {
				console.warn("Bot is not member of channel ["+place+"], can you manually add it?");
				// Error returned on channels.join: user_is_bot	(This method cannot be called by a bot user)
			}
		} else {
			// try with groups too
			for (key in this.slack.groups) {
				console.log("Group: "+this.slack.groups[key].name)
				if (this.slack.groups[key].name === place) {
					slackChannelOrGroup = this.slack.groups[key]
				}
			}
		}
		
		if (slackChannelOrGroup) {
			console.log("Sharing '%s' (on channel/group: %s)", text, place)
			slackChannelOrGroup.send(text)
		} else {
			console.log("Couldn't gain access to channel/group named '%s'. Sharing unsuccesful.", place)
		}
	},
	_registerAllMembers: function (users){
		var userNamesArray = [];
		Object.keys(users).forEach(function(key){
			var value = users[key];
			userNamesArray.push(value.name);
		});			
		this.bot.registerPlayers(userNamesArray);
	},
	_testApi: function(who) { // TODO - use this way to extend slack client
		var slackOpts = {bot: this.bot, from: who};
		this.slack._apiCall('api.test', {foo: 'bar'}, function(data) {
			return handle_api_response(data, {
				call: 'api.test',
				console: JSON.stringify({returned: data.args.foo}),
				msg: JSON.stringify({returned: data.args.foo}),
				slack: slackOpts
			})
		});
	},
	_listIM: function(who) {
		var slackOpts = {bot: this.bot, from: who}
		this.slack._apiCall('im.list', {}, function(data) {
			return handle_api_response(data, {
				call: 'im.list',
				console: JSON.stringify(data.ims),
				msg: JSON.stringify(data.ims[0]),
				slack: slackOpts
			})
		});
	},
	_searchTextPlace: function(query, who) {
		var slackOpts = {bot: this.bot, from: who}
		this.slack._apiCall('search.messages', {query: query}, function(data) {
			var success = handle_api_response(data, {
				call: 'search.messages',
				console: JSON.stringify(data.messages),
				msg: null,
				slack: slackOpts
			});
			if (success) {
				console.log("Successful invocation. Checking for matches...")
				if (data.messages && data.messages.total && data.messages.total > 1) {
					console.log("Got %s messages!", data.messages.total)
					var place = data.messages.matches.channel
					if (channel) {
						console.log("Got the channel! %s", channel.name)
						return channel.name;
					} else {
						console.error("The query [%s] returned no channel/group data. Returning null.", query)
					}
				} else {
					console.error("The query [%s] returned no messages, or no matches. Returning null.", query)	
				}
			} else {
				console.error("The query [%s] returned no data. Returning null.", query)
			}
		})
	}
}

var handle_api_response = function(data, options) {
	if (data) {
		var apiCall = options.call;
		var consoleMessage = options.console;
		var slackMessage = options.msg;
		var bot = options.slack.bot;
		var who = options.slack.from;
		if (data.error) {
			console.error("%s came back with an error: %s", apiCall, data.error)
			bot.say(who, apiCall+" came back with an error: "+data.error);
			return false;
		} else {
			console.log("%s API call came back with OK=%s; also got the following payload: %s", apiCall, data.ok, consoleMessage)
			if (slackMessage)
				bot.say(who, apiCall+" API call came back with OK="+data.ok+"; also got some payload: "+slackMessage)
			return true;
		}
	}
	return false;
}

module.exports = SlackConnector;
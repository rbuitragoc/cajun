var CollaborationManagerMock = require('./CollaborationManager.Mock.class')
var SlackConnectorMock = require('./SlackConnector.Mock.class')

function Cajunbot(){
	this.version = '666';
	this.config = {};
	this.reverseSayMap = {};
	this.reverseShareMap = {};
	this.connector = new SlackConnectorMock();

	this.collaborationManager = new CollaborationManagerMock();
}

module.exports = Cajunbot;

Cajunbot.prototype = {
	start: function(callback){
		
	},
	stop: function(callback){
		
	},
	channelJoined: function(channel, who){
		
	},
	message: function(from, text){

	},
	say: function(who, text){
		console.log("Saying '%s' to %s", text, who);
		this.reverseSayMap[text+"/"+who] = true;
	},
	share: function(text){
		console.log("Sharing '%s'", text);
		this.reverseShareMap[text] = true;
	},
	shareOn: function(place, text) {
		console.log("Sharing '%s' (on channel/group: %s)", text, place)
		this.reverseShareMap[text] = true;
	},
	registerPlayers: function(players){
		
	},
	registerPlayer: function(player){
		
	},
	said: function(message, player){
		return this.reverseSayMap[message+"/"+player] == true;
	},
	shared: function(message){
		return this.reverseShareMap[message] == true;
	},
}

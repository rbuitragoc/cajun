var CollaborationManagerMock = require('./CollaborationManager.Mock.class')
var SlackConnectorMock = require('./SlackConnector.Mock.class')

function Collabot(){
	this.version = '666';
	this.config = {};
	this.reverseSayMap = {};
	this.reverseShareMap = {};
	this.connector = new SlackConnectorMock();

	this.collaborationManager = new CollaborationManagerMock();
}

module.exports = Collabot;

Collabot.prototype = {
	start: function(callback){
		
	},
	stop: function(callback){
		
	},
	channelJoined: function(channel, who){
		
	},
	message: function(from, text){

	},
	say: function(who, text){
		console.log("Saying: "+text+" to "+who);
		this.reverseSayMap[text+"/"+who] = true;
	},
	share: function(text){
		console.log("Sharing: "+text);
		this.reverseShareMap[text] = true;
	},
	shareOn: function(text, where) {
		console.log("Sharing '%s' on %s", text, where)
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

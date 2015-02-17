function Collabot(){
	this.version = '666';
	this.config = {};
	this.reverseSayMap = {};
	this.reverseShareMap = {};
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

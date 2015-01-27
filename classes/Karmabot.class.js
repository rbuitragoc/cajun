function Karmabot(config){
	this.version = "0.1";
	this.config = config;
	this.connector = new config.connector(config);
	this.persistence = new config.persistence(config);
}

module.exports = Karmabot;

Karmabot.prototype = {
	start: function(){
		this.persistence.init();
		this.connector.init(this);
	},
	channelJoined: function(channel, who){
		
	},
	message: function(from, text){
		if (!text)
			return;
		if (text.indexOf("bot") == 0){
			if (text.indexOf("introduce yourself") > -1){
				this._introduce(from);
			} else if (text.indexOf("about") > -1){
				this._about(from);
			} else if (text.indexOf("help") > -1){
				this._help(from);
			} else if (text.indexOf("joke") > -1){
				this._joke();
			} else	if (text.indexOf("creator") > -1){
				this._creator();
			}else {
				this._wtf(from);
			}	
		}
	},
	_introduce: function (){
		this.share("I am the karmabot. Have fun!");
	},
	_about: function (){
		this.share("I am Karmabot version "+this.version+". I'm running on "+this.config.environment+" using the "+this.connector.name+" interactivity connector and the "+this.persistence.name+" persistance connector.");
	},
	_joke: function(){
		this.share("This is no time for jokes, my friend.");
	},
	_creator: function(){
		this.share("I am being created by VP karmabot dev team.");
	},
	_wtf: function(who){
		this.share("Perhaps you need to rephrase... ");
	},
	_help: function (who){
		this.say(who, "[bot about] Gets some information about the karmabot.");
	},
	say: function(who, text){
		this.connector.say(who, text);
	},
	share: function(text){
		this.connector.share(text);
	},
	registerPlayers: function(players){
		
	}
}
var DefaultConversationHandler = function(bot){
	this.bot = bot;
	this.showAttendantsRegexes = [
      /(attendants|people|person|((that|who).+(went|attended))).+(session|class|training)/
	]
}

DefaultConversationHandler.prototype = {
	handle: function (from, text){
		var handler = this;
		if (text.indexOf("hello "+this.bot.config.botName) > -1){
			this.bot.conversationManager.startConversation(from, "greeting", "waitingForMood", function(){
				handler.bot.share("Hey hello "+from+", how are you doing today?");	
			},
			function(conversation){
				// TODO: Add support to resume conversations
			});
		} else if (this.testRegexes(this.showAttendantsRegexes, text)){
			this.bot.conversationManager.startConversation(from, "showAttendants", "waitingForTrainingSession", function(conversation){
				handler.bot.trainingSessionManager.startShowAttendantsConversation(conversation, from);
			},
			function(conversation){
				// TODO: Add support to resume conversations
			});
		}
	},
	testRegexes: function(regexes, text){
		for (var i = 0; i < regexes.length; i++){
			var regex = regexes[i];
			if (regex.exec(text))
				return true;
		}
		return false;
	}
}


module.exports = DefaultConversationHandler;

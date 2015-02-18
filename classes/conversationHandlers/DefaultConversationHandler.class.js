var DefaultConversationHandler = function(bot){
	this.bot = bot;
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
		} else if (/show attendants to (.+)/.exec(text)){
			this.bot.conversationManager.startConversation(from, "showAttendants", "waitingForTrainingSession", function(conversation){
				handler.bot.trainingSessionManager.startShowAttendantsConversation(conversation, from);
			},
			function(conversation){
				// TODO: Add support to resume conversations
			});
		}
	}
}


module.exports = DefaultConversationHandler;
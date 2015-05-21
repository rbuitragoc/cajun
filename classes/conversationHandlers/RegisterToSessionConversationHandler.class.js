var RegisterToSessionConversationHandler = function(bot) {
	this.bot = bot;
}

RegisterToSessionConversationHandler.prototype = {
	handle: function (from, text, conversation){
		var bot = this.bot;
		var handler = this;
		console.log('Haaaaandling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}');

		if (conversation.state == 'waitingForRegistration') {
			var command = /(.+)$/.exec(text);
			if (!command || !command.length || !command.length == 2 && conversation.data.sessions) {
				handler.bot.say(from, 'Sorry, I  Can\'t understand that!');
			} else {
				var sessionIdOrName = command[1];
				this.bot.trainingSessionManager.registerToSession(from, sessionIdOrName, conversation, function(selectedSession) {
					// get the conversation data from the createTraining part!
					if (selectedSession) {
						bot.schedulingManager.scheduleAttendToSessionReminder(selectedSession, from);
						bot.schedulingManager.scheduleRateAttendedSessionReminder(selectedSession, from);
					}
					bot.conversationManager.endConversation(conversation);
				});
			}
		}
	}
}

module.exports = RegisterToSessionConversationHandler;
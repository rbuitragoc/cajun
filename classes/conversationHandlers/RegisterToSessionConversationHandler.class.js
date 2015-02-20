var RegisterToSessionConversationHandler = function(bot) {
	this.bot = bot;
}

RegisterToSessionConversationHandler.prototype = {
	handle: function (from, text, conversation){
		var handler = this;
		console.log('Haaaaandling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}');

		if (conversation.state == 'waitingForRegistration') {
			var command = /(.+)$/.exec(text);
			if (!command || !command.length || !command.length == 2 && conversation.data.sessions) {
				handler.bot.say(from, 'Sorry, I  Can\'t understand that!');
			} else {
				var sessionIdOrName = command[1];
				this.bot.trainingSessionManager.registerToSession(from, sessionIdOrName, conversation);
			}
		}
	}
}

module.exports = RegisterToSessionConversationHandler;
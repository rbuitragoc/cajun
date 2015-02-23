var ListAttendantsConversationHandler = function(bot) {
	this.bot = bot;
}

var StringUtils = require('../util/StringUtils.class')

ListAttendantsConversationHandler.prototype = {
	handle: function (from, text, conversation) {
		var handler = this;
		console.log('Handling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}');
		if (conversation.state == 'waitingForTrainingSession') {
			if (!StringUtils.isNumber(text)) {
				this.bot.say(from, "Please tell me the number of the training session.");
				return;
			}
			var keys = Object.keys(conversation.data.trainingSessions);
			var index = parseInt(text);
			if (index < 1 || index > keys.length) {
				this.bot.say(from,"Please use a number between 1 and "+keys.length+".");
				return;
			}
			this.bot.trainingSessionManager.showAttendantsTo(conversation, from, conversation.data.trainingSessions['k'+index]);
		}
	}
}

module.exports = ListAttendantsConversationHandler;
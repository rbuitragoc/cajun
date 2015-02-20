var ListAttendantsConversationHandler = function(bot){
	this.bot = bot;
}

ListAttendantsConversationHandler.prototype = {
	handle: function (from, text, conversation){
		var handler = this;
		console.log('Handling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}');
		if (conversation.state == 'waitingForTrainingSession'){
			var index = parseInt(text);
			if (!isNumber(index)){
				this.bot.say(from, "Please tell me the number of the training session.");
				return;
			}
			var keys = Object.keys(conversation.data.trainingSessionIds);
			if (index < 1 || index > keys.length){
				this.bot.say(from,"Please use a number between 1 and "+keys.length+".");
				return;
			}
			this.bot.trainingSessionManager.showAttendantsTo(conversation, from, conversation.data.trainingSessionIds['k'+index]);
		}
	}
}

function toS (obj) { return Object.prototype.toString.call(obj) }
function isNumber (obj) { return toS(obj) === '[object Number]' }

module.exports = ListAttendantsConversationHandler;
var async = require('async');

var ReportManager = function(bot) {
	this.bot = bot
	this.reportManager = this.bot.config.reportManager
}

ReportManager.prototype = {
	prepareForReport: function (who) {
		 var bot = this.bot
		 async.waterfall([
			 function(next) {
				 console.log("Starting conversation to generate report! ")
				 bot.conversationManager.startConversation(who, "report", "waitingForSessionToReport", function(conversation) {
					 next(false, conversation)
				 })
			 }, function(conversation, next) {
				 bot.persistence.getTrainingSessions(function(result, err) { // FIXME change this one for another that returns only those which have been rated at least by one person!
					 next(err, conversation, result);
				 });
			 }, function(conversation, trainingSessions, next) {
				 	if (trainingSessions.length > 0) {
						var sessions = "Rated sessions so far: \n";
						for (var i = 0; i < trainingSessions.length; i++) {
							var string = "" + (i+1) + " - '" + trainingSessions[i].title + "' on "+ trainingSessions[i].desiredDate +
										" " + trainingSessions[i].time +" ("+trainingSessions[i].duration + "h) @ " + trainingSessions[i].location + 
										" - Presenter: " + trainingSessions[i].presenter + "\n";
							sessions += string;
							trainingSessions[i].customId = i+1;
						}
						bot.conversationManager.setConversationData(conversation, 'sessions', trainingSessions, function(){});
						sessions += "Let's pick a session from the list (you can either spell the name or the number). If you don't want to continue with the report, you can say 'NO' and I'll stop.";
						bot.say(who, sessions);
					} else {
						bot.say(who, "No sessions have been rated so far. Make sure the attendants have registered via "+bot.config.botName+" and then rated the session.")
						bot.conversationManager.endConversation(conversation)
					}
			 }
		 ], function (err) {
			if (err) {
				bot.say(who,"Something happened when I tried to play waterfall... "+err);
			} 
		})
	},
	generateReport: function(from, selectedSession, conversation, callback) {
		var bot = this.bot
		console.log("Fetching ratings for session %s: ", JSON.stringify(selectedSession))
		this.bot.persistence.getSessionRatingsByTitle(selectedSession.title, function(err, result) {
			if (err) {
				callback(err, null)
			} else {
				console.log(JSON.stringify(result))
				bot.conversationManager.endConversation(conversation)
				callback(null, result);
			}
		})
		
	}
}

module.exports = ReportManager
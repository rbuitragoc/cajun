var async = require('async');

var ReportManager = function(bot) {
	this.bot = bot
	this.reportManager = this.bot.config.reportManager
}

ReportManager.prototype = {
	prepareForReport: function (conversation, who) {
		console.log("Entering prepareForReport()")
		var bot = this.bot
		async.waterfall([
			function (next) {
				console.log("Got as far as it should: asking for getRatedTrainingSessions()")
				bot.persistence.getRatedTrainingSessionsIds(function(err, result) {
					if (err) { 
						bot.conversationManager.endConversation(conversation)
						console.log("Got an error getting the ids! %s", err)
					} 
					console.log("Got ids! %s", result)
					next(err, conversation, result);
				});
			}, function(conversation, ids, next) {
				console.log("Then we got the ids, and we're off to get the actual training sessions!")
				bot.persistence.getRatedTrainingSessions(ids, function(err, results) {
					if (err) {
						bot.conversationManager.endConversation(conversation)
						console.log("Got an error getting the actual training data! %s", err)
					}
					console.log("Got ids! %s", results)
					next(err, conversation, results);
				})
			}, function (conversation, trainingSessions, next) {
				console.log("Then we're about to list them and tell the user...")
				if (trainingSessions.length > 0) {
					var sessions = "Rated sessions so far: \n";
					for (var i = 0; i < trainingSessions.length; i++) {
						console.log("Reading sessions: session %d with data %s", i, trainingSessions[i])
						var string = "" + (i+1) + " - '" + trainingSessions[i].title + "' on "+ trainingSessions[i].desiredDate +
							" " + trainingSessions[i].time +" ("+trainingSessions[i].duration + "h) @ " + trainingSessions[i].location + 
							" - Presenter: " + trainingSessions[i].presenter + "\n";
						sessions += string;
						trainingSessions[i].customId = i+1;
					}
					bot.conversationManager.setConversationData(conversation, 'sessions', trainingSessions, function(){});
					sessions += "Let's pick a session from the list (you can either spell the name or the number). If you don't want to continue with the report, you can say 'NO' and I'll stop.";
					
					bot.conversationManager.changeConversationState(conversation, 'waitingForSessionToReport', function(err, results) {
						bot.say(who, sessions);
					})
				} else {
					bot.say(who, "No sessions have been rated so far. Make sure the attendants have registered via "+bot.config.botName+" and then rated the session.")
					bot.conversationManager.endConversation(conversation)
				}
			}
			
		], function(err) {
			if (err) {
				bot.say(who,"Something happened when I tried to play waterfall... "+err);
				bot.conversationManager.endConversation(conversation)
			}
		})
	},
	generateReport: function(from, selectedSession, conversation, callback) {
		var bot = this.bot
		console.log("Fetching ratings for session %s: ", JSON.stringify(selectedSession))
		this.bot.persistence.getSessionRatingsByTitle(selectedSession.title, function(err, results) {
			if (err) {
				callback(err, null)
			} else {
				console.log(JSON.stringify(results))
				bot.conversationManager.endConversation(conversation)
				callback(null, results);
			}
		})
		
	}
}

module.exports = ReportManager
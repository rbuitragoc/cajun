var async = require('async');

var TrainingSessionManager = function(bot) {
	this.bot = bot;
	this.trainingSessionManager = this.bot.config.trainingSessionManager;
};

TrainingSessionManager.prototype =  {
	requestAuthorizationAsPresenter: function(requestor, presenter) {
		var bot = this.bot;
		var manager = this;
		async.waterfall([
			function(next) {
				if (requestor != manager.trainingSessionManager) {
					bot.say(requestor, "Sorry, only "+manager.trainingSessionManager+" can authorize people as presenters");
					return;
				}
				bot.persistence.getPlayerByName(presenter, function(player, err) {
					if (err) {
						bot.say(requestor, "I couldn't authorize "+presenter+", This happened: "+err);
					} else if (!player) {
						bot.say(requestor, "I don't know who is "+presenter+", may be you mistyped it?");
					} else {
						next();
					}
				});
			},
			function(next) {
				bot.persistence.getAuthorizedPresenter(presenter, function(presenterObject, err) {
					if (err) {
						bot.say(requestor, "I couldn't authorize "+presenter+", This happened: "+err);
						console.log(err);
					} else if (presenterObject) {
						bot.say(requestor, presenter+" is already an authorized presenter.");
					} else {
						next();
					}
				});
			},
			function(next) {
				bot.persistence.insertAuthorizedPresenter(presenter, function(result, err) {
					if (err) {
						bot.say(requestor, "I couldn't authorize "+presenter+", This happened: "+err);
					} else {
						bot.say(requestor, presenter+" has been authorized as presenter");
						bot.say(presenter, presenter+", you have been authorized by "+requestor+" as a presenter");
					}
				});
			}
		],
		function (error) {
			if (error) {
				console.log("General error.");
				console.log(error);
				console.log(error.stack);
				bot.say(requestor, "I couldn't authorize "+presenter+", This happened: "+error);
 			}
		});
	},
	createTrainingSession: function(creator, session, callback) {
		var bot = this.bot;
		bot.persistence.insertTrainingSession(session, callback);
		bot.say(creator, "The session has been created by "+creator+" and published.");
		bot.share("A training session has been created.");
	},
	initRegisterToSession: function(from) {
		var bot = this.bot;
		async.waterfall([
 			function(next) {
 				bot.conversationManager.startConversation(from, "registerToSession", "waitingForRegistration", 
 					function(conversation) {
 						next(false, conversation);
 					},
 					function(conversation) {
 						// TODO: Add support to resume conversations
 					}
 				);
 			}, function (conversation, next) {
 				bot.persistence.getTrainingSessions(function(result, err) {
 					next(err, conversation, result);
 				});
 			}, function (conversation, trainingSessions, next) {
 				var sessions = "Upcoming sessions \n";
				for (var i = 0; i < trainingSessions.length; i++) {
					var string = "" + (i+1) + " - '" + trainingSessions[i].title + "' on "+ trainingSessions[i].desiredDate +
								" " + trainingSessions[i].time +" ("+trainingSessions[i].duration + "h) @ " + trainingSessions[i].location + 
								" - Presenter: " + trainingSessions[i].presenter + "\n";
					sessions += string;
					trainingSessions[i].customId = i+1;
				}
				bot.conversationManager.setConversationData(conversation, 'sessions', trainingSessions, function(){});
				sessions += "Let's pick a session from the list (you can either spell the name or the number). If you don't want to enroll, you can say 'NO'.";
				bot.say(from, sessions);
 			}
 			],
 			function (err) {
				if (err) {
					bot.say(from,"Something happened when I tried to find out... "+err);
				} 
			}
		)
	},
	registerToSession: function(from, sessionIdOrName, conversation) {
		var bot = this.bot;
		var selectedSession = null;
		console.log("user " +from + " wants to enroll to "+ sessionIdOrName);

		for (var i = 0; i < conversation.data.sessions.length; i++) {
			var session = conversation.data.sessions[i];
			
			if (session.customId == sessionIdOrName || session.title == sessionIdOrName) {
				selectedSession = session;
				break;
			}
			
		}
		if (selectedSession) {
			var currentDate = new Date();
			currentDate.setDate(currentDate.getDate() + 1);

			var desiredDate = new Date(selectedSession.desiredDate);
			desiredDate.setDate(desiredDate.getDate() + bot.config.enrollmentDaysThreshold);

			if (currentDate <= desiredDate) {
				var hasRegistration = false;
				bot.persistence.getRegisteredUsers(from, selectedSession._id, function(result, err) {
					if (err) {
						bot.say(from,"Something happened when I tried to find out... "+err);
					} else {
						if (result && result.length > 0) {
							bot.say(from,"You are already enrolled to the selected training [" + selectedSession.title + "]");
							hasRegistration = true;
						} else {
							bot.persistence.insertRegisteredUsers(from, selectedSession._id,function(result, err){
								if (err) {
									bot.say(from,"Something happened when I tried to find out... "+err);
								} else {
									bot.say(from, "Great. You've been enrolled to '" + selectedSession.title + "' on " + selectedSession.desiredDate +
											" " + selectedSession.time + " @ " + selectedSession.location + ". See you there!");
									bot.conversationManager.endConversation(conversation);
								}
							});
						}
					}
				});
			} else {
				bot.say(from, 'Sorry, that session inscriptions have expired!');
			}
		} else if(sessionIdOrName == "NO") {
			bot.conversationManager.endConversation(conversation);
			bot.say(from,"Bye!");
		} else {
			bot.say(from, 'Sorry, that session does not exist!');
		}
	}
};

module.exports = TrainingSessionManager;
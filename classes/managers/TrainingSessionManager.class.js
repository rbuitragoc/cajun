var async = require('async');
var DateUtils = require('../util/DateUtils.class');

var TrainingSessionManager = function(bot) {
	this.bot = bot;
	this.trainingSessionManager = this.bot.config.edserv.manager;
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
	_endConversation: function(conversation){
		this.bot.conversationManager.endConversation(conversation);
	},
	startShowAttendantsConversation: function(conversation, from) {
		var bot = this.bot;
		var manager = this;
		async.waterfall([
			function(next){
				if (from == manager.trainingSessionManager) {
					next(false, {});
				} else {
					bot.persistence.getAuthorizedPresenter(from, function(presenterObject, err) {
						next(err, presenterObject);
					});
				}
			},
			function(presenterObject, next) {
				if (presenterObject) {
					next(false);
				} else {
					bot.say(from, "Only the EdServ manager or an authorized presenter can check the list, sorry!");
					manager._endConversation(conversation)
				}
			},
			function(next) {
				bot.persistence.getTrainings(function(trainings, err) {
					next(err, trainings);
				});
			},
			function (trainings, next) {
				if (!trainings || trainings.length == 0) {
					bot.say(from, "Hmmm... I know of no training sessions");
					manager._endConversation(conversation);
				} else {
					bot.say(from, "From which session do you wish to list the attendees?");
					for (var i = 0; i < trainings.length; i++) {
						var training = trainings[i];
						bot.say(from, (i+1)+" - \""+training.title+"\" by "+training.presenter);
						bot.conversationManager.setConversationData(conversation, 'trainingSessions.k'+(i+1), training, function(){});
					}
				}
			}
		],
		function (error) {
			if (error) {
				bot.say(from, "Heck, something happened! : "+err);
				console.log(error);
				console.log(error.stack);
 			}
		});
	},
	showAttendantsTo: function(conversation, requestor, training) {
		var bot = this.bot;
		var manager = this;
		var message = "You can try with another training, perhaps? Ask me again, in that case";
		console.log("Getting attendees for session");
		console.log(training);
		async.waterfall([
			function(next) {
				bot.persistence.getAttendants(training._id, function(attendantsList, err) {
					next(err, training, attendantsList);
				});
			},
			function(training, attendantsList, next) {
				if (!attendantsList || attendantsList.length == 0) {
					bot.say(requestor, "Nobody has registered for \""+training.title+"\". "+message);
				} else {
					bot.say(requestor, attendantsList.length+" people registered for \""+training.title+"\":");
					for (var i = 0; i < attendantsList.length; i++) {
						var attendant = attendantsList[i];
						bot.say(requestor, "- "+attendant.user);
					}
					bot.say(requestor, message);
				}
				manager._endConversation(conversation);
			}
		],
		function (error) {
			if (error) {
				bot.say(requestor, "Sorry, I couldn't complete your command: "+err);
				console.log(error);
				console.log(error.stack);
 			}
		});
	},
	initCreateTrainingSession: function(from) {
		var bot = this.bot;
		var edsrvManager = bot.config.edserv.manager;

		
		async.waterfall([
			function(next) {
				bot.persistence.getAuthorizedPresenter(from, function(presenterObject, err) {
					if (err) {
						bot.say(from, "I couldn't find authorize: " + from + " as presenter, This happened: " + err);
						console.log(err);
					} else if (presenterObject || (edsrvManager == from)) {
						console.log('presenter:', from, 'manager:', edsrvManager);
						next();
					} else {
						bot.say(from, "I couldn't find " + from + " as authorized presenter, contact your regional manager to do that");
					}
				});
			},
			function(next) {
				bot.conversationManager.startConversation(from, "createTrainingSession", "sessionTitle", function() {
					bot.say(from, "Wanna create a training session? that's awesome! First, what's this session going to be called? Type in the title for the session as you want it to appear for everyone else:");
				},					
				function(conversation) {
					// TODO: Add support to resume conversations
				})
			}
		],
		function (err) {
			if (err) {
				bot.say(from,"Something happened when I tried to find out... "+err);
			} 
		})
		
	},
	createTrainingSession: function(creator, session, callback) {
		var bot = this.bot;
		bot.persistence.insertTrainingSession(session, callback);
		bot.say(creator, "The session '"+session.title+"' has been created by you and published.");
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
				if (trainingSessions.length > 0) {
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
				} else {
					bot.say(from, "No sessions scheduled ahead. Stay tuned!")
					bot.conversationManager.endConversation(conversation)
				}
 			}
 			],
 			function (err) {
				if (err) {
					bot.say(from,"Something happened when I tried to find out... "+err);
				} 
			}
		)
	},
	registerToSession: function(from, sessionIdOrName, conversation, callback) {
		var bot = this.bot;
		var selectedSession = null;
		var noSessions = false;
		console.log("user " +from + " wants to enroll to "+ sessionIdOrName);
		
		if (!conversation.data.sessions) {
			noSessions = true;
		} else {
			for (var i = 0; i < conversation.data.sessions.length; i++) {
				var session = conversation.data.sessions[i];

				if (session.customId == sessionIdOrName || session.title == sessionIdOrName) {
					selectedSession = session;
					break;
				}
			}
		}

		if (selectedSession) {
			var desiredDate = new Date(selectedSession.desiredDate);
			var enrollmentHoursThreshold = bot.config.edserv.thresholds.enrollment;
			desiredDate.subtractHours(enrollmentHoursThreshold);

			if (new Date() < desiredDate) {
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
							callback(selectedSession);
						}
					}
				});
			} else {
				bot.say(from, "Sorry, that session inscriptions have expired! It's now " + new Date() + " but the threshold to register  to this session has pased (your last chance was before " + desiredDate + ")");
			}
		} else if (noSessions) {
			bot.conversationManager.endConversation(conversation);
			bot.say(from, "We'll be publishing new training sessions soon.")
		} else if (sessionIdOrName == "NO") {
			bot.conversationManager.endConversation(conversation);
			bot.say(from,"You chose not to attend any of the upcoming sessions. I'll remind you of any new sessions scheduled, so you'll have chance to register to those. Have a nice day");
		} else {
			bot.say(from, 'Sorry, that session does not exist!');
		}
	},
	initRateSession: function (requestor) {
		var bot = this.bot
		async.waterfall([
			function (next) {
				bot.conversationManager.startConversation(requestor, 'rateSession', 'waitingForSession', 
					function(conversation) {
 						next(false, conversation);
 					},
 					function(conversation) {
 						// TODO: Add support to resume conversations
 					})
				bot.say(requestor, "First thing's first, thanks for taking the time to anonymously rate a Breakfast & Learn. This is really important to us! Now, let's begin with selecting a session to rate. Which from the following sessions you've attended do you wish to rate?")
			},
			function (conversation, next) {
 				bot.persistence.getTrainings(function(result, err) {
 					next(err, conversation, result);
 				});
 			}, 
			function (conversation, trainingSessions, next) {
 				var sessions = ""
				for (var i = 0; i < trainingSessions.length; i++) {
					var string = "" + (i+1) + " - '" + trainingSessions[i].title + "' on "+ trainingSessions[i].desiredDate +
								" " + trainingSessions[i].time +" ("+trainingSessions[i].duration + "h) @ " + trainingSessions[i].location + 
								" - Presenter: " + trainingSessions[i].presenter + "\n"
					sessions += string
					trainingSessions[i].customId = i+1
				}
				bot.conversationManager.setConversationData(conversation, 'sessions', trainingSessions, function(){})
				
				var offices = ["BsAs", "Medellin", "Montevideo", "Rosario", "Parana"]
				bot.conversationManager.setConversationData(conversation, 'offices', offices, function(){})
				
				bot.say(requestor, sessions)
			}
		], function(){})
	},
	rateSession: function(conversationUserObject, callback) {
		var bot = this.bot
		var conversation = conversationUserObject.conversation
		var user = conversationUserObject.user
		var sessionRatingData = {
			sessionId: conversation.data.session._id,
			sessionTitle: conversation.data.session.title,
			ratingDate: new Date(),
			ratingOffice: conversation.data.office,
			ratings: {
				understanding: conversation.data.understandingRating,
				relevance: conversation.data.relevanceRating,
				performance: conversation.data.performanceRating,
				content: conversation.data.contentRating,
				methodology: conversation.data.methodologyRating,
				overall: conversation.data.overallRating
			},
			recommended: conversation.data.recommended,
			comments: conversation.data.comments
		}
		if (user) {
			sessionRatingData.user = user
		}
		bot.persistence.insertSessionRating(sessionRatingData, callback)
	}
};

module.exports = TrainingSessionManager;

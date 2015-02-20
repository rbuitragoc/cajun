var async = require('async');

var TrainingSessionManager = function(bot){
	this.bot = bot;
	this.trainingSessionManager = this.bot.config.trainingSessionManager;
};

TrainingSessionManager.prototype =  {
	requestAuthorizationAsPresenter: function(requestor, presenter){
		var bot = this.bot;
		var manager = this;
		async.waterfall([
			function(next){
				if (requestor != manager.trainingSessionManager){
					bot.say(requestor, "Sorry, only "+manager.trainingSessionManager+" can authorize people as presenters");
					return;
				}
				bot.persistence.getPlayerByName(presenter, function(player, err){
					if (err){
						bot.say(requestor, "I couldn't authorize "+presenter+", This happened: "+err);
					} else if (!player){
						bot.say(requestor, "I don't know who is "+presenter+", may be you mistyped it?");
					} else {
						next();
					}
				});
			},
			function(next){
				bot.persistence.getAuthorizedPresenter(presenter, function(presenterObject, err){
					if (err){
						bot.say(requestor, "I couldn't authorize "+presenter+", This happened: "+err);
						console.log(err);
					} else if (presenterObject){
						bot.say(requestor, presenter+" is already an authorized presenter.");
					} else {
						next();
					}
				});
			},
			function(next){
				bot.persistence.insertAuthorizedPresenter(presenter, function(result, err){
					if (err){
						bot.say(requestor, "I couldn't authorize "+presenter+", This happened: "+err);
					} else {
						bot.say(requestor, presenter+" has been authorized as presenter");
						bot.say(presenter, presenter+", you have been authorized by "+requestor+" as a presenter");
					}
				});
			}
		],
		function (error){
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
	startShowAttendantsConversation: function(conversation, from){
		var bot = this.bot;
		var manager = this;
		async.waterfall([
			function(next){
				if (from == manager.trainingSessionManager){
					next(false, {});
				} else {
					bot.persistence.getAuthorizedPresenter(from, function(presenterObject, err){
						next(err, presenterObject);
					});
				}
			},
			function(presenterObject, next){
				if (presenterObject){
					next(false);
				} else {
					bot.say(from, "Only "+manager.trainingSessionManager+" or an authorized presenter can check the list, sorry!");
					manager._endConversation(conversation)
				}
			},
			function(next){
				bot.persistence.getTrainings(function(trainings, err){
					next(err, trainings);
				});
			},
			function (trainings, next){
				if (!trainings || trainings.length == 0){
					bot.say(from, "Hmmm... I know of no training sessions");
					manager._endConversation(conversation);
				} else {
					bot.say(from, "What training session?");
					for (var i = 0; i < trainings.length; i++){
						var training = trainings[i];
						bot.say(from, (i+1)+" - \""+training.title+"\" by "+training.trainerName);
						bot.conversationManager.setConversationData(conversation, 'trainingSessionIds.k'+(i+1), training._id.$oid, function(){});
					}
				}
			}
		],
		function (error){
			if (error){
				bot.say(from, "Heck, something happened! : "+err);
				console.log(error);
				console.log(error.stack);
 			}
		});
	},
	showAttendantsTo: function(conversation, requestor, trainingId){
		var bot = this.bot;
		var manager = this;
		async.waterfall([
			function(next){
				bot.persistence.getTrainingById(trainingId, function(training, err){
					next(err, trainingSession)
				});
			},
			function(training, next){
				if (!training){
					next("I couldn't find the training session.");
				} else {
					next(false, training);
				}
			},
			function(training, next){
				bot.persistence.getAttendants(trainingSession._id, function(attendantsList, err){
					next(err, training, attendantsList);
				});
			},
			function(training, attendantsList, next){
				if (!attendantsList || attendantsList.length == 0){
					bot.say(requestor, "Noone registered for \""+training.title+"\"");
				} else {
					bot.say(requestor, attendantsList.length+" people registered for \""+training.title+"\":");
					for (var i = 0; i < attendantsList.length; i++){
						var attendant = attendantsList[i];
						bot.say(requestor, "- "+attendant.user);
					}
				}
				manager._endConversation(conversation);
			}
		],
		function (error){
			if (error){
				bot.say(requestor, "Sorry, I couldn't complete your command: "+err);
				console.log(error);
				console.log(error.stack);
 			}
		});
	}
};

module.exports = TrainingSessionManager;

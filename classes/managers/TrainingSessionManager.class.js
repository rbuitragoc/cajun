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
	}
};

module.exports = TrainingSessionManager;

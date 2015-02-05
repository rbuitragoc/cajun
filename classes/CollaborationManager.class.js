var CollaborationManager = function(){
};

var async = require('async');

CollaborationManager.prototype =  {
	givePoints: function(updateScoreRequest, bot){
		async.waterfall([
			function(next){
				bot.persistence.getPlayerByName(updateScoreRequest.fromPlayerName, function(player, err){
					if (err){
						bot.share("I couldn't give the points: "+err);
					} else if (!player){
						bot.persistence.insertNewPlayer(updateScoreRequest.fromPlayerName, function(player, err){
							if(!player || err){
								bot.share("I couldn't give the points: "+err);
								console.log(err.stack);
							} else {
								next(false, player);
							}
						});
					} else {
						next(false, player);
					}
				});
			},
			function(player, next){
				if (player.availableCollabPts < updateScoreRequest.collabPoints) {
					bot.share("You don't have enough points!");
				} else {
					next();
				}
			},
			function(next){
				bot.persistence.getPlayerByName(updateScoreRequest.toPlayerName, function(player, err){
					if (err){
						bot.share("I couldn't give the points: "+err);
					} else if (!player){
						bot.share("Who's that?");
					} else {
						next();
					}
				});
			},
			function(next){
				bot.persistence.updatePlayerScore(updateScoreRequest, function(player, err){
					if (err){
						bot.share("I couldn't give the points: "+err);
					} else {
						next();
					}
         		});
             },
             function(next) {
				bot.persistence.updateDailyScore(updateScoreRequest, function(player, err) {
					if (err) {
						bot.share("Unable to grant the points: " + err)
					} else {
						next()
					}
				})
             }, 
			 function(next) {
				bot.persistence.updateChannelScore(updateScoreRequest, function(player, err) {
					if (err) {
						bot.share("Unable to grant the points: " + err)
					} else {
						next()
					}
				})
             },
             function(next){
            	 bot.persistence.reducePlayerAvailablePoints(updateScoreRequest, function(player, err){
            		 if (err){
            			 bot.share("I couldn't give the points: "+err);
            		 } else {
            			 next();
            		 }
            	 });
			},
			function(next){
				bot.share("@"+updateScoreRequest.toPlayerName+", you have been given "+updateScoreRequest.collabPoints+" points by @"+updateScoreRequest.fromPlayerName);
			}
		],
        function (error){
			if (error) {
				console.log("General error.");
				console.log(error);
				console.log(error.stack);
				bot.share("I couldn't give the points: "+error);

			}
		});
	}
};

module.exports = CollaborationManager;
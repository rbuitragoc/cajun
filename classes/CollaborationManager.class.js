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
						bot.share("Who are you??");
					} else if (player.availableCollabPts < updateScoreRequest.collabPoints) {
						bot.share("You don't have enough points!");
					} else {
						next();
					}
				});
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
				bot.share("I couldn't give the points: "+error);
			}
		});
	}
};

module.exports = CollaborationManager;
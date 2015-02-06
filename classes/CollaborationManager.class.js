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
				bot.persistence.getDailyGrantedPoints(updateScoreRequest.fromPlayerName, function(dailyGrantedPoints, err){
					if (err){
						bot.share("I couldn't get Daily granted points: "+err);
					}
					else if (dailyGrantedPoints && updateScoreRequest.maxCollabPoints < (dailyGrantedPoints.collabPtsCount + updateScoreRequest.collabPoints)) {
						bot.share("You don't have enough points!");
					} 
					else {
						next(false, dailyGrantedPoints);
					}
				});
			},
            function(dailyGrantedPoints, next){
				bot.persistence.updateDailyGrantedPoints(updateScoreRequest, dailyGrantedPoints, function(player, err){
					if (err){
						bot.share("I couldn't set daily granted points: "+err);
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
 				bot.persistence.saveHistoricalGrant(updateScoreRequest, function(player, err){
 					if (err){
 						bot.share("Error Saving Historical Grant: "+err);
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
	},
	topTen: function(bot){
		bot.share("calculating top 10...");
		
		bot.persistence.getTopPlayersByPoints(10, function(result){
			var top = "";
			for(var i = 0; i < result.length; i++){
				var string = "#" + (i+1) + " - " + result[i].totalCollabPts + " CP - " + result[i].name + "\n";
				top += string;
			}
			bot.share(top);
		});
		
	}
};

module.exports = CollaborationManager;
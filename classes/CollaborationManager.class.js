var CollaborationManager = function(){
};

var async = require('async');
var DateUtils = require('./util/DateUtils.class');

CollaborationManager.prototype = {
	givePoints: function(updateScoreRequest, bot) {
		
var place = updateScoreRequest.channel;
		
		async.waterfall([
			function(next) {
				bot.persistence.getPlayerByName(updateScoreRequest.fromPlayerName, function(player, err) {
					if (err) {
						bot.shareOn(place, "I couldn't give the points: "+err);
					} else if (!player) {
						bot.persistence.insertNewPlayer(updateScoreRequest.fromPlayerName, function(player, err) {
							if (!player || err) {
								bot.shareOn(place, "I couldn't give the points: "+err);
								console.err(err.stack);
							} else {
								next(false, player);
							}
						});
					} else {
						next(false, player);
					}
				});
			},
			function(player, next) {
				bot.persistence.getDailyGrantedPoints(updateScoreRequest.fromPlayerName, function(dailyGrantedPoints, err) {
					if (err) {
						bot.shareOn(place, "I couldn't get Daily granted points: "+err);
					} else if (dailyGrantedPoints && updateScoreRequest.maxCollabPoints < (dailyGrantedPoints.collabPtsCount + updateScoreRequest.collabPoints)) {
						var msg = "You don't have enough points!";
						bot.shareOn(place, msg);
					} else {
						next(false, dailyGrantedPoints);
					}
				});
			},
			function(dailyGrantedPoints, next) {
				bot.persistence.updateDailyGrantedPoints(updateScoreRequest, dailyGrantedPoints, function(player, err) {
					if (err) {
						var msg = "I couldn't set daily granted points: "+err
						bot.shareOn(place, msg);
					} else {
						next();
					}
				});
			},
			function(next) {
				bot.persistence.getPlayerByName(updateScoreRequest.toPlayerName, function(player, err) {
					if (err) {
						var msg = "I couldn't give the points: "+err;
						bot.shareOn(place, msg);
						console.error(msg)
					} else if (!player) {
						bot.shareOn(place, "Who's that?");
					} else {
						next();
					}
				});
			},
			function(next) {
				bot.persistence.updatePlayerScore(updateScoreRequest, function(player, err ){
					if (err) {
						var msg = "I couldn't give the points: "+err;
						bot.shareOn(place, msg);
					} else {
						next();
					}
				});
			},
			function(next) {
				bot.persistence.updateDailyScore(updateScoreRequest, function(player, err) {
					if (err) {
						var msg = "I couldn't give the points: "+err;
						bot.shareOn(place, msg);
					} else {
						next()
					}
				})
			}, 
 			function(next) {
				bot.persistence.updateChannelScore(updateScoreRequest, function(player, err) {
					if (err) {
						var msg = "I couldn't give the points: "+err;
						bot.shareOn(place, msg);
					} else {
						next()
					}
				})
			},
			function(next) {
				bot.persistence.saveHistoricalGrant(updateScoreRequest, function(player, err) {
					if (err) {
						var msg = "Error Saving Historical Grant: "+err;
						bot.shareOn(place, msg);
					} else {
						next();
					}
				});
			},
			function(next) {
				bot.shareOn(place, "@"+updateScoreRequest.toPlayerName+", you have been given "+updateScoreRequest.collabPoints+" points by @"+updateScoreRequest.fromPlayerName);
			}
		],
		function (error){
			if (error) {
				console.log("General error.");
				console.log(error);
				console.log(error.stack);
				var msg = "I couldn't give the points: "+err;
				bot.shareOn(place, msg);
			}
		});
	},
	topTen: function(period, channel, bot, postToChannel){
		var shareStr = "Calculating top 10..." + new Date();
		shareStr += period ? ". Period: " + period: "";
		shareStr += channel ? ". Channel: " + channel: "";
		bot.shareOn(postToChannel, shareStr);

		console.log("period:" + period);
		console.log("channel:" + channel);
		bot.persistence.getTopPlayersByPoints(10, period, channel, function(result){
			console.log(result);
			var top = (!result || result.length == 0) ? "No data found" : "";
			for(var i = 0; i < result.length; i++){
				var string = "#" + (i+1) + " - " + result[i].totalCollabPoints + " CP - " + result[i]._id + "\n";
				top += string;
			}
			bot.shareOn(postToChannel, top);
		});
		
	},
	tellStatusTo: function(playerName, bot){
		var status = {};
		var today = DateUtils.getCurrentDate();
		async.waterfall([
 			function(next){
 				bot.persistence.getPlayerByName(playerName, function(player, err){
 					if (err){
 						bot.say(player, "Something happened when I tried to find out... "+err);
 						next(err);
 					} else if (!player){
 						bot.say(player, "I don't know you, how would I know?");
 						next(err);
 					} else {
 						status.totalCollabPts = player.totalCollabPts;
 						next(false);
 					}
 				});
 			},
 			function(next){
 				bot.persistence.getPlayerDailyScore(playerName, function(player, err){
 					console.log("daily");
 					console.log(player);
 					if (err){
 						bot.say(player, "Something happened when I tried to find out... "+err);
 						next(err);
 					} else if (!player){
 						
 						status.dailyScore = 0;
 						next(false);
 					} else {
 						status.dailyScore = player.collabPts;
 						next(false);
 					}
 				});
 			},
 			function(next){
 				console.log("getting info for week "+today.week);
 				bot.persistence.getPlayerWeeklyScore(playerName, today.week, today.year, function(weeklyScore, err){
 					console.log("weeklyScore");
 					console.log(weeklyScore);
 					if (err){
 						bot.say(player, "Something happened when I tried to find out... "+err);
 						next(err);
 					} else {
 						status.weeklyScore = weeklyScore;
 						next(false);
 					}
 				});
 			},
 			function(next){
 				var lastWeek = today.week - 1;
 				var lastYear = today.year;
 				if (lastWeek == 0){
 					lastWeek = DateUtils.getLastWeekOf(lastYear-1);
 					lastYear --;
 				}
 				console.log("getting info for week "+lastWeek);
 				bot.persistence.getPlayerWeeklyScore(playerName, lastWeek, lastYear, function(weeklyScore, err){
 					if (err){
 						bot.say(player, "Something happened when I tried to find out... "+err);
 						next(err);
 					} else {
 						status.lastWeekScore = weeklyScore;
 						next(false);
 					}
 				});
 			},
 			function(next) {
 				bot.say(playerName, "You have been given "+status.totalCollabPts+" CollabPoints so far.");
 				bot.say(playerName, "Today, you have won "+status.dailyScore+" CollabPoints.");
 				bot.say(playerName, "This week you have been given a total of "+status.weeklyScore+" CollabPoints.");
 				bot.say(playerName, "Last week you were given a total of "+status.lastWeekScore+" CollabPoints.");
 			}
 		],
        function (error){
			console.log("General error.");
			console.log(error);
			console.log(error.stack);
 			bot.share("I couldn't give the points: "+error);
		}
 		);
	}
};

module.exports = CollaborationManager;

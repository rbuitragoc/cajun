var MongoSkin = require('mongoskin');
var DateUtils = require('../util/DateUtils.class');

function MongoConnector(config){
	this.name = 'MongoConnector';
	this.db = MongoSkin.db(config.dbURL, {nativeParser: true});
}

MongoConnector.prototype = {
	init: function(){},
	insertNewPlayer: function(playerName, callback){
		this.db.collection('players').insert(
			{
				name: playerName,
				totalCollabPts: 0
			},
			function(err, result) {MongoConnector.defaultHandler(err,result,callback);}
		);
	},
	updatePlayerScore: function(updateScoreRequest, callback){
		this.db.collection('players').update(
			{ name: updateScoreRequest.toPlayerName}, 
			{
				$inc: { totalCollabPts: updateScoreRequest.collabPoints},
				$setOnInsert: {
					name: updateScoreRequest.toPlayerName
				}
			},
			{ upsert: true },
			function(err, result) {MongoConnector.defaultHandler(err,result,callback);}
		);
	},
    updateDailyScore: function(updateScoreRequest, callback) {
		var currentTime = new Date(),
			year = currentTime.getUTCFullYear(),
			month = currentTime.getUTCMonth() + 1,
			week = currentTime.getWeek(),
			day = currentTime.getUTCDate();
		var now =  new Date().formatYYYYMMDD();
		
		this.db.collection('dailyScores').update(
			{ 
				time: now, 
				channel: updateScoreRequest.channel,
				player: updateScoreRequest.toPlayerName
			},
			{
				$inc: { collabPts: updateScoreRequest.collabPoints },
				$setOnInsert: {
					player: updateScoreRequest.toPlayerName,
					channel: updateScoreRequest.channel,
					day: day,
					week: week,
					month: month,
					year: year,
					time: now
				}
			},
			{ upsert: true },
			function(err, result) { MongoConnector.defaultHandler(err, result, callback); }
      	)
    },
	updateChannelScore: function(updateScoreRequest, callback) {
		this.db.collection('channelScores').update(
			{ 
				channel: updateScoreRequest.channel,
				player: updateScoreRequest.toPlayerName
			},
			{
				$inc: { collabPts: updateScoreRequest.collabPoints },
				$setOnInsert: {
					player: updateScoreRequest.toPlayerName,
					channel: updateScoreRequest.channel
				}
			},
			{ upsert: true },
			function(err, result) { MongoConnector.defaultHandler(err, result, callback); }
		)
	},
	saveHistoricalGrant: function(updateScoreRequest, callback){
		var now = new Date().toISOString();
		this.db.collection('historicalGrants').insert(
				{ 
					from: updateScoreRequest.fromPlayerName,
					to: updateScoreRequest.toPlayerName,
					timestamp: now,
					collabPts: updateScoreRequest.collabPoints
				},
				function(err, result) {MongoConnector.defaultHandler(err,result,callback);}
			);
		},
	getPlayerByName: function(playerName, callback){
		this.db.collection('players').find({name: playerName}).toArray(
			function (err, result) {
				if (err) {
					console.log(err);
			    } else {
			    	var player = result[0];
			    	callback(player);
			    }
		    }
	    );
	},
	getTopPlayersByPoints : function(numberOfPlayers, period, channel, callback) {
		var currentTime = new Date();
		var match = {
			year : currentTime.getFullYear()
		};
		if(channel){
			match.channel = channel;
		}
		if(period){
			var currentTime = new Date();

			switch(period) {
			    case "week":
					match.week = currentTime.getWeek();
			        break;
			    case  "day":
					match.day = currentTime.getDate();
			    case  "month":
					match.month = currentTime.getMonth() + 1;
			        break;
			    default:
			}
		}
		
		var operators = [ {
			$match : match
		}, {
			$group : {
				_id : "$player",
				totalCollabPoints : {
					$sum : "$collabPts"
				}
			}
		}, {
			"$sort" : {
				totalCollabPoints : -1
			}
		}, {
			"$limit" : numberOfPlayers
		} ];
		this.db.collection('dailyScores').aggregate(operators,
			function (err, result) {
				if (err) {
					console.log(err);
			    } else {
			    	callback(result);
			    }
		    }
		);
	},
	getDailyGrantedPoints: function(playerName, callback){
		this.db.collection('dailyGrantedPoints').find({player: playerName, time:  new Date().formatYYYYMMDD()}).toArray(
			function (err, result) {
				if (err) {
					console.log(err);
			    } else {
			    	var dailyGrantedPoints = result[0];
			    	callback(dailyGrantedPoints);
			    }
		    }
	    );
	},
	updateDailyGrantedPoints: function(updateScoreRequest, dailyGrantedPoints, callback){
  		 if (!dailyGrantedPoints){
  			this.db.collection('dailyGrantedPoints').insert(
				{
					player: updateScoreRequest.fromPlayerName,
					collabPtsCount: updateScoreRequest.collabPoints,
					time: new Date().formatYYYYMMDD()
				},
				function(err, result) {MongoConnector.defaultHandler(err,result,callback);}
			);
  		 } else {
  			this.db.collection('dailyGrantedPoints').update(
				{ player: updateScoreRequest.fromPlayerName, time: new Date().formatYYYYMMDD()}, 
				{
					$inc: { collabPtsCount: updateScoreRequest.collabPoints},
				},
				{},
				function(err, result) {MongoConnector.defaultHandler(err,result,callback);}
			);
  		 }
	},
	getPlayerDailyScore: function(playerName, callback){
		this.db.collection('dailyScores').find({player: playerName, time: new Date().formatYYYYMMDD()}).toArray(
			function (err, result) {
				if (err) {
					console.log(err);
			    } else {
			    	var dailyScore = result[0];
			    	callback(dailyScore);
			    }
		    }
	    );
	},
	getPlayerWeeklyScore: function(playerName, week, year, callback){
		var operators = [
		                 {
		     				$match : {
		     					player : playerName,
		     					week : week,
		     					year: year
		     				}
		                 },
		     			{
		                 	$group : {
		     					_id : "$week",
		     					total : {
		     						$sum : "$collabPts"
		     					}
		                 	}
		                 }
		     		 ];
		this.db.collection('dailyScores').aggregate(operators, function(err, score) {
			if (err) {
				console.log(err);
			} if (score.length == 0){
				callback(0);
			}else {
				callback(score[0].total);
			}
		});
	},
	insertConversation: function(conversation, callback){
		this.db.collection('conversations').insert(conversation, function(err, result) {MongoConnector.defaultHandler(err,result,callback);});
	},
	updateConversation: function(topic, withPlayer, updateObject, callback){
		this.db.collection('conversations').update({topic: topic, withPlayer: withPlayer}, updateObject, {}, function(err, result) {MongoConnector.defaultHandler(err,result,callback);});
	},
	getConversations: function(person, callback){
		this.db.collection('conversations').find({withPlayer: person}).toArray(
			function (err, results) {
				if (err) {
					console.log(err);
			    } else {
			    	callback(err, results);
			    }
		    }
	    );
	},
	getConversation: function(topic, person, callback){
		this.db.collection('conversations').find({topic: topic, withPlayer: person}).toArray(
			function (err, results) {
				if (err) {
					console.log(err);
			    } else if (results.length > 0){
			    	callback(err, results[0]);
			    } else {
			    	callback(err, false);
			    }
		    }
	    );
	},
	deleteConversation: function(topic, withPlayer, callback){
		this.db.collection('conversations').remove({topic: topic, withPlayer: withPlayer}, function(err, result) {MongoConnector.defaultHandler(err,result,callback);});
	},
	insertAuthorizedPresenter: function(presenter, callback){
		this.db.collection('authorizedPresenters').insert({presenter: presenter}, function(err, result) {MongoConnector.defaultHandler(err,result,callback);});
	},
	getAuthorizedPresenter: function(person, callback){
		this.db.collection('authorizedPresenters').find({presenter: person}).toArray(
			function (err, results) {
				if (err) {
					console.log(err);
			    } else if (results.length > 0){
			    	callback(results[0], err);
			    } else {
			    	callback(false, err);
			    }
		    }
	    );
	},
	getTrainings: function(callback){
		this.db.collection('trainings').find().toArray(function(err, result){MongoConnector.defaultHandler(err,result,callback);});
	},
	getTrainingById: function(id, callback){
		this.db.collection('trainings').findById(id).toArray(function(err, result) { MongoConnector.singleResultHandler(err,result,callback);});
	},
	getAttendants: function(trainingSessionId, callback){
		this.db.collection('registeredUsers').find({sessionId: trainingSessionId}).toArray(function(err, result) { MongoConnector.defaultHandler(err,result,callback);});
	},
	insertTrainingSession: function(trainingData, callback){
		this.db.collection('trainings').insert(trainingData, function(err, result) {MongoConnector.defaultHandler(err,result,callback);})
	},
	getTrainingSessions: function(callback) {
		// modifying this to retrieve only the sessions that have not yet taken place
		this.db.collection('trainings').find().sort({'desiredDate': -1}).toArray(
			function (err, result) {
				if (err) {
					console.log(err);
			    } else {
						var filteredResult = new Array();
						for (var i = 0; i < result.length; i++) {
							var desiredDate = result[i].desiredDate;
							var time = result[i].time;
							var title = result[i].title;
							// cherry pick from feature/reminders and create date from bot vars
							var trainingDate = new Date().fromExpressions(desiredDate, time);
							console.log("getTrainingSessions: training '%s' has date '%s'", title, trainingDate)
							// use date to determine if the training session has already passed or not
							if (!trainingDate.hasPassed()) {
							// add to filteredResult only pending training sessions
								filteredResult.push(result[i]);
							} else {
								console.log("The training session titled '%s' has already passed (Today it's %s). Skipping...", title, new Date());
							}
						}
			    	callback(filteredResult);
			    }
		    }
	    );
	},
  insertRegisteredUsers: function(user, sessionId, callback){
    this.db.collection('registeredUsers').insert({
      user : user,
      sessionId : sessionId,
      date : new Date(),
      notified : true
    }, function(err, result) {
      MongoConnector.defaultHandler(err, result, callback);
    });
  },
  getRegisteredUsers: function(user, sessionId, callback){
    this.db.collection('registeredUsers').find({user : user, sessionId : sessionId}).toArray(
      function (err, result) {
        if (err) {
          console.log(err);
          } else {
            callback(result);
          }
        }
    );
  },
  insertSessionRating: function(sessionRatingData, callback) {
    this.db.collection('sessionRatings_BNL').insert(sessionRatingData, function(err, result) {MongoConnector.defaultHandler(err, result, callback)})
  },
  // Reminders 
  insertReminder: function(reminder, callback){
    this.db.collection('reminders')
      .insert(reminder, function(err, result) {
        MongoConnector.defaultHandler(err, result, callback)
      }
    );    
  },
  getReminders: function (callback) {
    this.db.collection('reminders').find().toArray(
      function (err, result) {
        if (err) {
          console.log(err);
          } else {
            callback(result);
          }
        }
    );
  },
  deleteReminder: function (id, callback) {
    this.db.collection('reminders').remove({_id : id}, 
      function(err, result) {
        MongoConnector.defaultHandler(err,result,callback);
      }
    );
  } 
}

MongoConnector.defaultHandler = function (err, result, callback) {
	if (err) {
		console.log(err);
		console.log("Mongo DB error.");
    }
    callback(result, err);
};

MongoConnector.singleResultHandler = function (err, result, callback) {
	if (err) {
		console.log(err);
		console.log("Mongo DB error.");
    }
	if (result && result.length){
		callback(result[0], err);
	} else {
		callback(result, err);
	}
};

module.exports = MongoConnector;

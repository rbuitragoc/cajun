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
				availableCollabPts: 10,
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
					name: updateScoreRequest.toPlayerName,
					availableCollabPts: 10
				}
			},
			{ upsert: true },
			function(err, result) {MongoConnector.defaultHandler(err,result,callback);}
		);
	},
    updateDailyScore: function(updateScoreRequest, callback) {
		var currentTime = new Date(),
			year = currentTime.getFullYear(),
			month = currentTime.getMonth(),
			day = currentTime.getDay() + 1;
		var now = year + '-' + month + '-' + day;
		
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
					//week, TODO!
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
	reducePlayerAvailablePoints: function(updateScoreRequest, callback){
		this.db.collection('players').update(
			{ name: updateScoreRequest.fromPlayerName}, 
			{
				$inc: { availableCollabPts: -updateScoreRequest.collabPoints}
			},
			{},
			function(err, result) {MongoConnector.defaultHandler(err,result,callback);}
		);
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
	getTopPlayersByPoints: function(numberOfPlayers, callback){
		this.db.collection('players').find().sort({'totalCollabPts': -1}).limit(numberOfPlayers).toArray(
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
	}
}

MongoConnector.defaultHandler = function (err, result, callback) {
	if (err) {
		console.log(err);
		console.log("Mongo DB error.");
    }
    callback(result, err);
};

module.exports = MongoConnector;

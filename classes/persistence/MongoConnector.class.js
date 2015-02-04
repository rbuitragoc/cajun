var MongoSkin = require('mongoskin');

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
}

MongoConnector.defaultHandler = function (err, result, callback) {
	if (err) {
		console.log(err);
		console.log("Mongo DB error.");
    }
    callback(result, err);
};

module.exports = MongoConnector;

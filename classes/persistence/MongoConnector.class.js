var MongoSkin = require('mongoskin');

function MongoConnector(config){
	this.name = 'MongoConnector';
	this.db = MongoSkin.db(config.dbURL, {nativeParser: true});
}

MongoConnector.prototype = {
	init: function(){},
	updatePlayerScore: function(updateScoreRequest, callback){
		this.db.collection('players').update(
			{name: updateScoreRequest.playerName}, 
			{
				$add: { totalCollabPts: updateScoreRequest.collabPoints},
				$setOnInsert: {
					name: updateScoreRequest.playerName,
					availableCollabPts: 10,
					totalCollabPts: updateScoreRequest.collabPoints
				}
			},
			{ upsert: true },
			function(err, result) {MongoConnector.defaultHandler(err,result,callback);}
		);
	}
}

MongoConnector.defaultHandler = function (err, result, callback) {
	if (err) {
		console.log(err);
    } else {
    	callback(result, err);
    }
};

module.exports = MongoConnector;

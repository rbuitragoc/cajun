var assert = require('assert');
var TrainingSessionManager = require('../../classes/managers/TrainingSessionManager.class');
var Collabot = require('../Collabot.Mock.class.js');

function setupMocks(){
	var mockBot = new Collabot();
	mockBot.config.trainingSessionManager = 'slizarazo';
	mockBot.persistence = {
		getPlayerByName: function(presenter, callback){
			if (presenter === 'ancisar')
				callback(false);
			else
				callback({});
		},
		getAuthorizedPresenter: function(presenter, callback){
			if (presenter === 'mrthomas')
				callback({});
			else
				callback(false);
		},
		insertAuthorizedPresenter: function(presenter, callback){
			callback({});
		}
	}
	return {
		bot: mockBot
	}
}

function testManagerCanAuthPresenters() {
	// Initialize and inject mocks
	var mocks = setupMocks();
	var mockBot = mocks.bot;
	// Initialize object of class under test (real class, not mock)
	var manager = new TrainingSessionManager(mockBot);
	// Execute operation under test
	manager.requestAuthorizationAsPresenter('slizarazo', 'slash');
	// Assert results
	setTimeout(function(){
		assert(mockBot.said("slash has been authorized as presenter", "slizarazo"), "Message not sent to admin");
		assert(mockBot.said("slash, you have been authorized by slizarazo as a presenter", "slash"), "Message not sent to presenter");
	}, 1000);
}

function testNonManagerCannotAuthPresenters() {
	// Initialize and inject mocks
	var mocks = setupMocks();
	var mockBot = mocks.bot;
	// Initialize object of class under test (real class, not mock)
	var manager = new TrainingSessionManager(mockBot);
	// Execute operation under test
	manager.requestAuthorizationAsPresenter('rbuitrago', 'slash');
	// Assert results
	setTimeout(function(){
		assert(mockBot.said("Sorry, only slizarazo can authorize people as presenters", "rbuitrago"), "Message not sent to requester");
	}, 1000);
}

module.exports = { 
	testManagerCanAuthPresenters: testManagerCanAuthPresenters,
	testNonManagerCannotAuthPresenters: testNonManagerCannotAuthPresenters
}
var assert = require('assert');
var TrainingSessionManager = require('../../classes/managers/TrainingSessionManager.class');
var Collabot = require('../Collabot.Mock.class.js');

function setupMocks(){
	var mockBot = new Collabot();
	mockBot.config.edserv = {manager: 'mrmanager'};
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
		},
		insertTrainingSession: function(presenter, callback){
			callback();
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
	manager.requestAuthorizationAsPresenter('mrmanager', 'slash');
	// Assert results
	setTimeout(function(){
		assert(mockBot.said("slash has been authorized as presenter", "mrmanager"), "Message not sent to admin");
		assert(mockBot.said("slash, you have been authorized by mrmanager as a presenter", "slash"), "Message not sent to presenter");
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
		assert(mockBot.said("Sorry, only mrmanager can authorize people as presenters", "rbuitrago"), "Message not sent to requester");
	}, 1000);
}

function testPreexistingPresenters() {
	// Initialize and inject mocks
	var mocks = setupMocks();
	var mockBot = mocks.bot;
	// Initialize object of class under test (real class, not mock)
	var manager = new TrainingSessionManager(mockBot);
	// Execute operation under test
	manager.requestAuthorizationAsPresenter('mrmanager', 'mrthomas');
	// Assert results
	setTimeout(function(){
		assert(mockBot.said("mrthomas is already an authorized presenter.", "mrmanager"), "Message not sent to admin");
	}, 1000);
}

function testUnexistingPresenters() {
	// Initialize and inject mocks
	var mocks = setupMocks();
	var mockBot = mocks.bot;
	// Initialize object of class under test (real class, not mock)
	var manager = new TrainingSessionManager(mockBot);
	// Execute operation under test
	manager.requestAuthorizationAsPresenter('mrmanager', 'ancisar');
	// Assert results
	setTimeout(function(){
		assert(mockBot.said("I don't know who is ancisar, may be you mistyped it?", "mrmanager"), "Message not sent to admin");
	}, 1000);
}

function testCreateTrainingSession() {
	// Initialize and inject mocks
	var mocks = setupMocks();
	var mockBot = mocks.bot;
	// Initialize object of class under test (real class, not mock)
	var manager = new TrainingSessionManager(mockBot);
	// Execute operation under test
	var session = { 
		contents: 'How to dominate the world',
		description: 'World domination desc',
       	desiredDate: '2015/03/25',
       	duration: '1 hour',
       	location: 'Medellín',
       	presenter: 'gguevara',
       	requirements: 'Nothing',
       	sessionType: 'BNL',
       	slides: '10',
       	targetAudience: 'Everybody',
       	time: '08:30',
       	title: 'World Domination' 
   	};

}

 

module.exports = { 
	testManagerCanAuthPresenters: testManagerCanAuthPresenters,
	testNonManagerCannotAuthPresenters: testNonManagerCannotAuthPresenters,
	testPreexistingPresenters: testPreexistingPresenters,
	testUnexistingPresenters: testUnexistingPresenters,
	testCreateTrainingSession: testCreateTrainingSession
}
var assert = require('assert');
var CommandConversationHandler = require('../../classes/conversationHandlers/CommandConversationHandler.class');
var Collabot = require('../Collabot.Mock.class');

var mocks = (function setupMocks(){
	var mockBot = new Collabot();
	mockBot.config = {
		maxCollabPoints: undefined
	}
	mockBot.connector = {slackChannel: {name: undefined}};
	return {
		bot: mockBot
	}
}())

function testAtSignSupported() {
	//Given
	var testTextWithAtSign = "give 6 points to @expected";
	var testTextWithoutAtSign = "give 6 points to expected"; //Destinatary can come without @ (Backwards compatibility)
	var from = "author"; //Author always comes without @
	var mockbot = mocks.bot;
	var testedClassInstance = new CommandConversationHandler(mockbot)

	//When a valid string without at sign is given
	testedClassInstance._give(from, testTextWithoutAtSign)
	//Then The fromPlayerName attribute in the request must be the expected
	var receivedArguments = mockbot.collaborationManager.givenArguments['givePoints'];
	assert.equal(receivedArguments[0].toPlayerName, 'expected', 'The player name wasn\'t captured from text')
	
	//When avalid string with the at sign is given
	testedClassInstance._give(from, testTextWithAtSign)
	//Then The fromPlayerName attribute in the request must be the expected
	var receivedArguments = mockbot.collaborationManager.givenArguments['givePoints'];
	assert.equal(receivedArguments[0].toPlayerName, 'expected', 'The player name wasn\'t captured from text')
}

module.exports = {
	testAtSignSupportedOnReference: testAtSignSupported
}
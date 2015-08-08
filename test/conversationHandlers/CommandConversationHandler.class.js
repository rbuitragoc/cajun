var assert = require('assert');
var CommandConversationHandler = require('../../classes/conversationHandlers/CommandConversationHandler.class');
var Cajunbot = require('../Cajunbot.Mock.class');

var mocks = (function setupMocks(){
	var mockBot = new Cajunbot();
	mockBot.config = {
		maxCollabPoints: undefined
	}
	mockBot.connector['slackChannel'] = {name: undefined};
	return {
		bot: mockBot
	}
}())

function testAtSignSupported() {
	//Given
	var testTextWithAtSign = "give 6 points to <@Uexpectedid|expected>";
	var testTextWithAtSignWithoutUserName = "give 6 points to <@Uexpectedid>";
	var testTextWithExtraComment = "give 6 points to <@Uexpectedid> for being awesome";
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
	receivedArguments = mockbot.collaborationManager.givenArguments['givePoints'];
	assert.equal(receivedArguments[0].toPlayerName, 'expected', 'The player name wasn\'t captured from text')

	
	//When avalid string with the at sign is given
	mockbot.connector.mockedResponses['findUserById'] = {name: "expected"};
	testedClassInstance._give(from, testTextWithAtSignWithoutUserName)
	//Then The fromPlayerName attribute in the request must be the expected
	var queriedUserId = mockbot.connector.givenArguments['findUserById'];
	receivedArguments = mockbot.collaborationManager.givenArguments['givePoints'];
	assert.equal(queriedUserId[0], 'Uexpectedid', 'With user id in the string, the user was not queried with the connector' );
	assert.equal(receivedArguments[0].toPlayerName, 'expected', 'The queried string to the connector wasn\'t returned in response' );

	//When avalid string with the at sign is given
	mockbot.connector.mockedResponses['findUserById'] = {name: "expected"};
	testedClassInstance._give(from, testTextWithExtraComment)
	//Then The fromPlayerName attribute in the request must be the expected
	var queriedUserId = mockbot.connector.givenArguments['findUserById'];
	receivedArguments = mockbot.collaborationManager.givenArguments['givePoints'];
	assert.equal(queriedUserId[0], 'Uexpectedid', 'With user id int he string, the user was not queried with the connector' );
	assert.equal(receivedArguments[0].toPlayerName, 'expected', 'The queried string to the connector wasn\'t returned in response' );
}

module.exports = {
	testAtSignSupportedOnReference: testAtSignSupported
}
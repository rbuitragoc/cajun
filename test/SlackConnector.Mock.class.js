function SlackConnectorMock() {
	this.givenArguments = {};
	this.mockedResponses = {};
}

SlackConnectorMock.prototype = {
	findUserById: function() {
		this.givenArguments['findUserById'] = arguments;
		return this.mockedResponses['findUserById'];
	},
	findUserByName: function() {
		this.givenArguments['findUserByName'] = arguments
		return this.mockedResponses['findUserByName']
	},
	shareOn: function(place, text) {
		this.givenArguments['shareOn'] = arguments
		return this.mockedResponses['shareOn']
	}
}

module.exports = SlackConnectorMock;
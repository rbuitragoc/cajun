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
	}
}

module.exports = SlackConnectorMock;
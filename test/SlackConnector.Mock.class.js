function SlackConnectorMock() {
	this.givenArguments = {};
	this.mockedResponses = {};
}

SlackConnectorMock.prototype = {
	findUserById: function() {
		this.givenArguments['findUserById'] = arguments;
		return this.mockedResponses['findUserById'];
	}
}

module.exports = SlackConnectorMock;
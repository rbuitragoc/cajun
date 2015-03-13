function CollaborationManagerMock() {
	this.givenArguments = {};
}

CollaborationManagerMock.prototype = {
	givePoints: function() {
		this.givenArguments['givePoints'] = arguments;
	}
}

module.exports = CollaborationManagerMock;
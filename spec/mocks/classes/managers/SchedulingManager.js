module.exports = {
	bot: {
		share: jasmine.createSpy('share'),
		collaborationManager: {
			givePoints: jasmine.createSpy('givePoints')
		},
		connector: {
			slackChannel: {
				name: 'any'
			},
			findUserById: function () {
				return {name: 'jhon_doe'};
			}
		},
		config: {
			maxCollabPoints: 10
		}
	}
}
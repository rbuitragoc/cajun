var CommandConversationHandler = require('./../../../../classes/conversationHandlers/CommandConversationHandler.class')

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
			findUserById: function (userId) {
				if (userId && userId.indexOf('collabot') >-1) {
					return { name: userId, "is_bot": true }
				}
				return {name: 'jhon_doe'};
			}
		},
		config: {
			maxCollabPoints: 10
		}
	}
};
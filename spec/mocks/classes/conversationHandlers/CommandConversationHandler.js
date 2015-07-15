var CommandConversationHandler = require('./../../../../classes/conversationHandlers/CommandConversationHandler.class')

module.exports = {
	bot: {
		share: jasmine.createSpy('share'),
		shareOn: jasmine.createSpy('shareOn'),
		smartSay: jasmine.createSpy('smartSay'),
		collaborationManager: {
			givePoints: jasmine.createSpy('givePoints')
		},
		conversationHandler: {
			startConversation: jasmine.createSpy('startConversation')
		},
		reportManager: {
			prepareForReport: jasmine.createSpy('prepareForReport')
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
			},
			findUserByName: function (userName) {
				if (userName && userName.indexOf('bot') != -1) {
					return {name: userName, "is_bot": true}
				}
			}
		},
		config: {
			maxCollabPoints: 10
		}
	}
};
var RateSessionConversationHandler = function(bot) {
	this.bot = bot
}

RateSessionConversationHandler.prototype = {
	handle: function (from, text, conversation) {
		var that = this
		console.log('RateSessionHandling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}')
		if (conversation.state == 'waitingForSession') {
			
		} else if (conversation.state == 'waitingForOffice') {
			
		} else if (conversation.state == 'waitingForUnderstandingRating') {
			
		} else if (conversation.state == 'waitingForRelevanceRating') {
			
		} else if (conversation.state == 'waitingForPerformanceRating') {
			
		} else if (conversation.state == 'waitingForContentRating') {
			
		} else if (conversation.state == 'waitingForMethodologyRating') {
			
		} else if (conversation.state == 'waitingForRecommendation') {
			
		} else if (conversation.state == 'waitingForOverallRating') {
			
		} else if (conversation.state == 'waitingForComments') {
			
		} else if (conversation.state == 'waitingForAnonymousMode') {
			
		} else if (conversation.state == 'readyToSave') {
			
		}
	}
}
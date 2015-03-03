var RateSessionConversationHandler = function(bot) {
	this.bot = bot
}

RateSessionConversationHandler.prototype = {
	handle: function (from, text, conversation) {
		var that = this
		var conversationManager = that.bot.conversationManager
		console.log('RateSessionHandling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}')
		
		if (conversation.state == 'waitingForSession') {
			var selectedSession = null
			for (var i = 0; i < conversation.data.sessions.length; i++) {
				var session = conversation.data.sessions[i]
				if (session.customId == text || session.title == text) {
					selectedSession = session
					break
				}
			}
			if (selectedSession) {
				this.bot.conversationManager.setConversationData(conversation, 'session', selectedSession, function() {})
				this.bot.conversationManager.changeConversationState(conversation, 'waitingForOffice', function() {})
				this.bot.say(from, "'"+selectedSession.title+"'? That sounds great. From which of these offices did you attend? BsAs, Medellin, Montevideo, Rosario, Parana")
			} else {
				this.bot.say(from, "That doesn't look like a valid session to rate.")
			}
			
		} else if (conversation.state == 'waitingForOffice') {
			var offices = conversation.data.offices.split(/\s+/)
			var selectedOffice = null
			for (var i = 0; i < offices.length; i++) {
				var anOffice = offices[i]
				if (text == anOffice) {
					selectedOffice = anOffice
					break
				}
			}
			if (selectedOffice) {
				this.bot.conversationManager.setConversationData(conversation, 'office', selectedOffice, function() {})
				this.bot.conversationManager.changeConversationState(conversation, 'waitingForUnderstandingRating', function () {})
				this.bot.say(from, "'"+selectedOffice+"'? Excellent! Now, let's start rating the training. How well you think you UNDERSTOOD the Breakfast&Learn topics? (1-5 scale)")
			} else {
				this.bot.say(from, "Sorry, we don't have an office there (yet?)")
			}
			
		} else if (conversation.state == 'waitingForUnderstandingRating') {
			if (isNaN(text) || (text < 1 || text > 5) || !(text % 1 === 0)) {
				this.bot.say(from, "Can't understand that rating.")
			} else {
				this.bot.conversationManager.setConversationData(conversation, 'understandingRating', text, function() {})
				this.bot.conversationManager.changeConversationState(conversation, 'waitingForRelevanceRating', function() {})
				this.bot.say(from, "'"+text+"'? Thanks. How readily you think you can APPLY the Breakfast&Learn session topics in a real project? (1-5 scale)")
			}
			
		} else if (conversation.state == 'waitingForRelevanceRating') {
			if (isNaN(text) || (text < 1 || text > 5) || !(text % 1 === 0)) {
				this.bot.say(from, "Can't understand that rating.")
			} else {
				this.bot.conversationManager.setConversationData(conversation, 'relevanceRating', text, function() {})
				this.bot.conversationManager.changeConversationState(conversation, 'waitingForPerformanceRating', function() {})
				this.bot.say(from, "'"+text+"'? Thanks. How well would you evaluate the presenter's performance? (1-5 scale)")
			}
			
		} else if (conversation.state == 'waitingForPerformanceRating') {
			if (isNaN(text) || (text < 1 || text > 5) || !(text % 1 === 0)) {
				this.bot.say(from, "Can't understand that rating.")
			} else {
				this.bot.conversationManager.setConversationData(conversation, 'performanceRating', text, function() {})
				this.bot.conversationManager.changeConversationState(conversation, 'waitingForContentRating', function() {})
				this.bot.say(from, "'"+text+"'? Thanks. How do you rate the CONTENT of this session? (1-5 scale)")
			}
			
		} else if (conversation.state == 'waitingForContentRating') {
			if (isNaN(text) || (text < 1 || text > 5) || !(text % 1 === 0)) {
				this.bot.say(from, "Can't understand that rating.")
			} else {
				this.bot.conversationManager.setConversationData(conversation, 'contentRating', text, function() {})
				this.bot.conversationManager.changeConversationState(conversation, 'waitingForMethodologyRating', function() {})
				this.bot.say(from, "'"+text+"'? Thanks. How do you rate the TOOLS and METHODOLOGY of this session? (1-5 scale, or any comment on this you may want to add instead)")
			}
			
		} else if (conversation.state == 'waitingForMethodologyRating') {
			
			this.bot.conversationManager.setConversationData(conversation, 'methodologyRating', text, function() {})
			this.bot.conversationManager.changeConversationState(conversation, 'waitingForRecommendation', function() {})
			this.bot.say(from, "'"+text+"'? Thanks. Would you recommend this Breakfast & learn to others? (yes/no)")
			
		} else if (conversation.state == 'waitingForRecommendation') {
			if (text != "yes" && text != "no"){
				this.bot.say(from, "I'm sorry, was that a yes, or a no?")
			} else {
				this.bot.conversationManager.setConversationData(conversation, 'recommended', text, function() {})
				this.bot.conversationManager.changeConversationState(conversation, 'waitingForOverallRating', function() {})
				this.bot.say(from, "'"+text+"'? Thanks. How do you rate the Breakfast & Learn session in general? (1-5 scale)")
			}
			
		} else if (conversation.state == 'waitingForOverallRating') {
			if (isNaN(text) || (text < 1 || text > 5) || !(text % 1 === 0)) {
				this.bot.say(from, "Can't understand that rating.")
			} else {
				this.bot.conversationManager.setConversationData(conversation, 'overallRating', text, function() {})
				this.bot.conversationManager.changeConversationState(conversation, 'waitingForComments', function() {})
				this.bot.say(from, "'"+text+"'? Thanks. Finally, do you have any other suggestions or comments?")
			}
			
		} else if (conversation.state == 'waitingForComments') {
			
			this.bot.conversationManager.setConversationData(conversation, 'comments', text, function() {})
			this.bot.conversationManager.changeConversationState(conversation, 'waitingForAnonymousMode', function() {})
			this.bot.say(from, "Thanks! One last thing. You can let us (or not) save your name on this survey. This is useful in case we need to contact you to follow up you ideas or suggestions. It will remain anonymous if you decline, don't worry :)  (yes/no)")
			
		} else if (conversation.state == 'waitingForAnonymousMode') {
			if (text != "yes" && text != "no") {
				this.bot.say(from, "I'm sorry, was that a yes, or a no?")
			} else {
				if (text == "yes") {
					console.log("the user said YES!")
					this.bot.conversationManager.setConversationData(conversation, 'user', from, function() {})
				}
				this.bot.conversationManager.changeConversationState(conversation, 'done', function(){})
				this.bot.trainingSessionManager.rateSession(from, conversation, function(result, err) {
					if (err) {
						console.error("An error occurred when trying to save session rating! "+err.stack)
					} else {
						console.log("Succesfully saved session rating! "+result)
					}
					this.bot.conversationManager.endConversation(conversation, function() {})
				})
				this.bot.say(from, "'"+text+"'? Wonderful. This is it, we're done here. Again, thanks for taking the time, we appreciate it!")
				
			}
			
		} else {
			console.log("Got another message for a conversation in an unknown state: "+conversation.state+". Don't know what to do.")
		}
	}
}

module.exports = RateSessionConversationHandler

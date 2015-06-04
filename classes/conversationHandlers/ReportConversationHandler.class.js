var ReportConversationHandler = function(bot) {
	this.bot = bot
}

ReportConversationHandler.prototype = {
	handle: function(from, text, conversation) {
		var that = this
		var bot = this.bot
		var conversationManager = that.bot.conversationManager
		console.log('ReportHandling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}')
		
		if (conversation.state == 'waitingForSessionToReport') {
			if (text == "NO") {
				bot.say(from, "You've chosen not to generate any report. Have a nice day.")
				bot.conversationManager.endConversation(conversation)
				return
			} 
			var selectedSession = null
			for (var i = 0; i < conversation.data.sessions.length; i++) {
				var session = conversation.data.sessions[i]
				if (session.customId == text || session.title == text) {
					selectedSession = session
					break
				}
			}
			if (selectedSession) {
				this.bot.reportManager.generateReport(from, selectedSession, conversation, function(err, result) {
					if (err) {
						console.error("Error when generating rated sessions report: "+err)
						bot.conversationManager.endConversation(conversation)
					} else {
						if (result) {
							// FIXME need to CSV the result!
							// TODO  PRINT THE FILE LOCATION? POST THE LINK?
							console.log("Got the raw report result from DB! \n[%s]", result)
						}
						console.log("No report result? Go figure! Nothing to do here, I'm finishing conversation now.")
						bot.conversationManager.endConversation(conversation)
					}
				})
			} else {
				this.bot.say(from, "There's nothing to do here. No session selected (no sessions rated?)")
				this.bot.conversationManager.endConversation(conversation)
			}
			
		} 
		
	}
}

module.exports = ReportConversationHandler
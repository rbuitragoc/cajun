var csv = require('csv')
var fs = require('fs')

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
							console.log("Got the raw report result from DB! \n[%s]", JSON.stringify(result))
							csv.transform(result, function(data) {
								// XXX escape commas for csv: this should go to StringUtils sometime soon?
								var escapedComments = (data.comments.indexOf(',')!=-1)? '"'+data.comments+'"':data.comments
								var escapedMethodology = (data.ratings.methodology.indexOf(',')!=-1)? '"'+data.ratings.methodology+'"':data.ratings.methodology
								
								var csvLine = data.sessionTitle + ',' + data.ratingDate + ',' + data.ratingOffice + ',' + data.ratings.overall + ',' + data.ratings.understanding + ',' + data.ratings.content + ',' + data.ratings.relevance + ',' + data.ratings.performance + ',' + escapedMethodology + ',' + data.recommended + ',' + escapedComments + ','
								csvLine = (data.user)? csvLine + data.user + '\n': csvLine + '\n'
								return csvLine
							}).pipe(csv.stringify(function(err, output) {
								output = "title,rating date,office,overall rating,understanding rating,content rating,relevance rating,performance rating,methodology rating,recommended,comments,user\n" + output
								console.log("READY TO SEE THE CSV? \n%s", output)
								var fileName = 'report-'+selectedSession.presenter + Date.now()+'.csv'
								var file = fs.writeFile(fileName, output, function(err) {
									if (err) console.error(err)
									else console.log("Written file %s successfully. Ch-ch ch-ch ch-ch-check it out!", fileName)
									bot.say(from, 'Got your CSV report file ready, and I promise I will post a link for you to download soon. Ask somebody to retrieve this file ('+fileName+') from the bot server for you, in the meantime.')
									bot.conversationManager.endConversation(conversation)
								})
							// TODO  PRINT THE FILE LOCATION? POST THE LINK?
							}))
						} else {
							console.log("No report result? Go figure! Nothing to do here, I'm finishing conversation now.")
							bot.conversationManager.endConversation(conversation)
						}
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
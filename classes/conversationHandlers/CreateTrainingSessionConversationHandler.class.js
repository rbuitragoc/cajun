var DateUtils = require('../util/DateUtils.class')

var CreateTrainingSessionConversationHandler = function(bot){
	this.bot = bot;
}

CreateTrainingSessionConversationHandler.prototype = {
	handle: function(from, text, conversation){
		var that = this;
		console.log('Handling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}');
		if (conversation.state == 'sessionTitle') {
			this.bot.say(from, "Your session's title will be: "+text);
			this.bot.say(from, "It sounds really interesting, let's keep talking about it!");
			this.bot.conversationManager.setConversationData(conversation, 'title', text, function(){});
			// using this chance to set two pieces of data to conversation
			this.bot.conversationManager.setConversationData(conversation, 'presenter', from, function(){});
			/*this.bot.conversationManager.changeConversationState(conversation, "sessionType", function(){
				that.bot.say(from, "Is this a Breakfast & Learn (B&L) or an Internal Training? What type of training session are we creating?");
			});
		}

		if (conversation.state == 'sessionType'){
			this.bot.say(from, "So, it's a "+text+ "!");
			this.bot.say(from, "Those are always cool.");
			this.bot.conversationManager.setConversationData(conversation, 'sessionType', text, function(){});*/
			this.bot.conversationManager.changeConversationState(conversation, "description", function(){
				that.bot.say(from, "How about giving me a brief description of your training Session? Maybe some context will help people understand what it is about.");
			});			
		}

		if (conversation.state == 'description'){
			this.bot.say(from, "Your training session's description will be: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'description', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "contents", function(){
				that.bot.say(from, "What will you be sharing with other VP'ers? Provide your audience with a breakdown of the topics you'll discuss.");
			});
		}
		if (conversation.state == 'contents'){
			this.bot.say(from, "Here's what you'll be presenting: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'contents', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "requirements", function(){
				that.bot.say(from, "What previous knowledge does your audience need to have? Java, Javascript, Objective-C? Nothing?");
			});
		}
		if (conversation.state == 'requirements'){
			this.bot.say(from, "Here's what people need to know for your presentation: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'requirements', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "targetAudience", function(){
				that.bot.say(from, "Who are you trying to reach with this training session? Developers? QAs? Managers? Everybody?");
			});
		}
		if (conversation.state == 'targetAudience'){
			this.bot.say(from, "You're trying to reach this audience: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'targetAudience', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "duration", function(){
				that.bot.say(from, "How long will the " + conversation.data.title + " training session take? You can enter decimal values, I will save those as hours.");
			});			
		}
		if (conversation.state == 'duration'){
			this.bot.say(from, "You'll need a good way to keep people interested!");
			this.bot.conversationManager.setConversationData(conversation, 'duration', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "slides", function(){
				that.bot.say(from, "How many slides do you have?");
			});			
		}
		if (conversation.state == 'slides'){
			this.bot.say(from, "Remember to make them very clear and concise. Add value with your slides!");
			this.bot.conversationManager.setConversationData(conversation, 'slides', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "location", function(){
				that.bot.say(from, "Where will you be giving this training session? We have offices in Medellín - Colombia, Rosario - Argentina, Buenos Aires - Argentina, Paraná - Argentina and Montevideo - Uruguay. We're everywhere!");
			});
		}
		if (conversation.state == 'location'){
			this.bot.say(from, text + " is a pretty cool place.");
			this.bot.conversationManager.setConversationData(conversation, 'location', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "desiredDate", function(){
				that.bot.say(from, "When will this training session take place? (YYYY/MM/DD)");
			});			
		}
		if (conversation.state == 'desiredDate'){
			var match = /^\d{4}\/\d{1,2}\/\d{1,2}$/.exec(text);
			if(match){
				var date = new Date(match[0]);				
				if(!date.beforeDate(new Date())) {
					this.bot.say(from, "What are you, a time traveler? Come on.");
				} else {
					this.bot.say(from, text + " sounds like a good time for '"+conversation.data.title+"'.");
					this.bot.conversationManager.setConversationData(conversation, 'desiredDate', text, function(){});
					this.bot.conversationManager.changeConversationState(conversation, "time", function(){
						that.bot.say(from, "That looks good. Let's set an hour for the session (e.g. 08:00 or 14:30)");
					});	
				}				
			} else {
				this.bot.say(from, "What's that? I asked for this format (YYYY/MM/DD), come on.");
			}
		}
		if (conversation.state == 'time'){
			if (/^\d{1,2}:\d{2}$/.exec(text)) {
				this.bot.say(from, text + " sounds good to me.");
				this.bot.conversationManager.setConversationData(conversation, 'time', text, function(){});
				this.bot.conversationManager.changeConversationState(conversation, "save", function(){
					that.bot.say(from, "Now that we have all the data required, we can launch the training. If you agree, we'll handle the notifications to all interested, and follow up on them to rate the training after they attended to it. Should we save and finish the creation of the training session? (YES/NO)");
				});				
			} else {
				this.bot.say(from, "What's that? I asked for this format (HH:MM), come on.");
			}			
		}
		if (conversation.state == 'save'){
			if(text.indexOf("YES")>-1){
				this.bot.say(from, "Cool. We're doing this! Enjoy your day!");
				this.bot.trainingSessionManager.createTrainingSession(from, conversation.data, function(res, err){
					if (err){
						that.bot.say(from, "I couldn't save the training session: "+err);
					} else {
						that.bot.share("@channel The training session: \""+res[0].title+"\" was created.");
						that.bot.share("The training session: \"" + res[0].title + "\" has been created.");
						that.bot.share("It will take place at the " + res[0].location + " office.");
						that.bot.share("@" + res[0].presenter + " will be presenting it on " + res[0].desiredDate + " at " + res[0].time + "." );
						that.bot.share("You can enroll to this training session by asking '"+that.bot.config.botName+", show me upcoming sessions'");
					}
				});
				// TODO implment RegionManager as per https://trello.com/c/7XBXBYQN
				this.bot.schedulingManager.scheduleRegisterToSessionReminder(conversation.data, this.bot.config.edserv.regional.medellin) 
				// ALSO TODO: while we don't have a way to check attendance yet, we must assume all registered actually attended the session and are therefore allowed to rate it
				this.bot.conversationManager.endConversation(conversation);
			} else {
				this.bot.say(from, "Ok... Let me know when you decide to go for it. Keep in mind I'll hold waiting for a 'YES'.");
			}
		}
	}	
}	

module.exports = CreateTrainingSessionConversationHandler;
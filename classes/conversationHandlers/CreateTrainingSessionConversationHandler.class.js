var CreateTrainingSessionConversationHandler = function(bot){
	this.bot = bot;
}

CreateTrainingSessionConversationHandler.prototype = {
	handle: function(from, text, conversation){
		var that = this;
		console.log('Handling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}');
		if (conversation.state == 'sessionTitle'){
			this.bot.say(from, "Your session's title will be: "+text);
			this.bot.say(from, "It sounds really interesting, let's keep talking about it!");
			this.bot.conversationManager.setConversationData(conversation, 'title', text, function(){});
			/*this.bot.conversationManager.changeConversationState(conversation, "sessionType", function(){
				that.bot.say(from, "Is this a Breakfast & Learn (B&L) or an Internal Training? What type of training session are we creating?");
			});
		}

		if (conversation.state == 'sessionType'){
			this.bot.say(from, "So, it's a "+text+ "!");
			this.bot.say(from, "Those are always cool.");
			this.bot.conversationManager.setConversationData(conversation, 'sessionType', text, function(){});*/
			this.bot.conversationManager.changeConversationState(conversation, "description", function(){
				that.bot.say(from, "How about giving me a brief description of your B&L Session? Maybe some context will help people understand what it is about.");
			});			
		}

		if (conversation.state == 'description'){
			this.bot.say(from, "Your B&L session's description will be: "+text);
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
				that.bot.say(from, "Who are you trying to reach with this B&L session? Developers? QAs? Managers? Everybody?");
			});
		}
		if (conversation.state == 'targetAudience'){
			this.bot.say(from, "You're trying to reach this audience: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'targetAudience', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "duration", function(){
				that.bot.say(from, "How long will the " + conversation.data.title + " B&L session take? You can enter decimal values, I will save those as hours.");
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
				that.bot.say(from, "Where will you be giving this B&L session? We have offices in Medellín - Colombia, Rosario - Argentina, Buenos Aires - Argentina, Paraná - Argentina and Montevideo - Uruguay. We're everywhere!");
			});
		}
		if (conversation.state == 'location'){
			this.bot.say(from, text + " is a pretty cool place.");
			this.bot.conversationManager.setConversationData(conversation, 'location', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, "desiredDate", function(){
				that.bot.say(from, "When do you want to give the B&L session? (YYYY/MM/DD)");
			});			
		}
		if (conversation.state == 'desiredDate'){
			var match = /^\d{4}\/\d{1,2}\/\d{1,2}$/.exec(text);
			if(match){
				var date = new Date(match[0]);
				console.log(date);
				var curDate = new Date();
				console.log(curDate);
				if(date < curDate){
					this.bot.say(from, "What are you, a time traveler? Come on.");
				} else{
					this.bot.say(from, text + " sounds good to me.");
					this.bot.conversationManager.setConversationData(conversation, 'desiredDate', text, function(){});
					this.bot.conversationManager.changeConversationState(conversation, "time", function(){
						that.bot.say(from, "That looks good. At what time will you be giving the B&L session? (e.g. 08:30 or 8:30am)");
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
					that.bot.say(from, "What do you think, should we go ahead and notify people about this B&L session? (YES/NO)");
				});				
			} else {
				this.bot.say(from, "What's that? I asked for this format (HH:MM), come on.");
			}			
		}
		if (conversation.state == 'save'){
			if(text.indexOf("YES")>-1){
				this.bot.say(from, "Cool. We're doing this.");
				this.bot.trainingSessionManager.createTrainingSession(from, conversation.data, function(res, err){
					if (err){
						that.bot.say(from, "I couldn't save the B&L session: "+err);
					} else {
						that.bot.share("@channel The B&L session: \""+res[0].title+"\" was created.");
						that.bot.share("The B&L session: \"" + res[0].title + "\" has been created.");
						that.bot.share("It will take place at the " + res[0].location + " office.");
						that.bot.share("@" + res[0].presenter + " will be presenting it on " + res[0].desiredDate + " at " + res[0].time + "." );
						that.bot.share("You can enroll to this B&L session by asking 'Collabot, show me upcoming sessions'");
					}
				});
				this.bot.conversationManager.endConversation(conversation);
			} else {
				this.bot.say(from, "Ok... Let me know when you decide to go for it.");
			}
		}
	}	
}	

module.exports = CreateTrainingSessionConversationHandler;
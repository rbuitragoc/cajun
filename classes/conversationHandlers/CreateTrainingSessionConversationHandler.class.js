var CreateTrainingSessionConversationHandler = function(bot){
	this.bot = bot;
}

CreateTrainingSessionConversationHandler.prototype = {
	handle: function(from, text, conversation){
		var handler = this;
		console.log('Handling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}');
		if (conversation.state == 'presenters'){
			if (text.indexOf("me") != -1){
				this.bot.share("Cool! I thought so. You're a very good presenter.");
				this.bot.conversationManager.setConversationData(conversation, 'presenter', text, function(){});
				this.bot.conversationManager.changeConversationState(conversation, 'sessionTitle', function(){
					handler.bot.share("Now, what's this session going to be called? Type in the title for the session as you want it to appear for everyone else.");
				});
			} else if (text){
				var presenter = this.bot.persistence.getPlayerByName(text);
				if(!presenter){
					this.bot.share("Sorry, I don't know who "+text+ " is. Can you double-check?");
				} else {
					this.bot.share("Great! I'm sure " + presenter + " will do a great job.")
					this.bot.conversationManager.changeConversationState(conversation, 'sessionTitle', function(){
						handler.bot.share("Now, what's this session going to be called? Type in the title for the session as you want it to appear for everyone else.");
					});
				}
				
			}
		}
		if (conversation.state == 'sessionTitle'){
			this.bot.share("Your session's title will be: "+text);
			this.bot.share("It sounds really interesting, let's keep talking about it!");
			this.bot.conversationManager.setConversationData(conversation, 'title', text, function(){});
			this._nextState(conversation, "description", "How about giving me a brief description of your session? Maybe some context will help people understand what this is about.");
		}
		if (conversation.state == 'description'){
			this.bot.share("Your session's description will be: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'description', text, function(){});
			this._nextState(conversation, "contents", "What will you be sharing with other VP'ers? Provide your audience with a breakdown of the topics you'll discuss.");
		}
		if (conversation.state == 'contents'){
			this.bot.share("Here's what you'll be presenting: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'contents', text, function(){});
			this._nextState(conversation, "requirements", "What previous knowledge does your audience need to have? Java, Javascript, Objective-C? Nothing?");
		}
		if (conversation.state == 'requirements'){
			this.bot.share("Here's what people need to know for your presentation: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'requirements', text, function(){});
			this._nextState(conversation, "targetAudience", "Who are you trying to reach with this session? Developers? QAs? Managers? Everybody?");
		}
		if (conversation.state == 'targetAudience'){
			this.bot.share("You're trying to reach this audience: "+text);
			this.bot.conversationManager.setConversationData(conversation, 'targetAudience', text, function(){});
			this._nextState(conversation, "duration", "How long do you need to give the talk about " + conversation.data.title + "?");
		}
		if (conversation.state == 'duration'){
			this.bot.share("You'll need a good way to keep people interested!");
			this.bot.conversationManager.setConversationData(conversation, 'duration', text, function(){});
			this._nextState(conversation, "slides", "How many slides do you have?");
		}
		if (conversation.state == 'slides'){
			this.bot.share("Remember to make them very clear and concise. Add value with your slides!");
			this.bot.conversationManager.setConversationData(conversation, 'slides', text, function(){});
			this._nextState(conversation, "location", "Where will you be giving this talk? We have offices in Medellín - Colombia, Rosario - Argentina, Buenos Aires - Argentina, Paraná - Argentina and Montevideo - Uruguay. We're everywhere!");
		}
		if (conversation.state == 'location'){
			this.bot.share(text + " is a pretty cool place.");
			this.bot.conversationManager.setConversationData(conversation, 'location', text, function(){});
			this._nextState(conversation, "desiredDate", "When do you want to give the talk? (YYYY/MM/DD)");
		}
		if (conversation.state == 'desiredDate'){
			this.bot.share(text + " sounds good to me.");
			this.bot.conversationManager.setConversationData(conversation, 'desiredDate', text, function(){});
			this._nextState(conversation, "time", "At what time will you be giving the talk?");
		}
		if (conversation.state == 'time'){
			this.bot.share(text + " sounds good to me.");
			this.bot.conversationManager.setConversationData(conversation, 'time', text, function(){});
			this.bot.share("This is the training session we just created. What do you think, should we go ahead and notify people? (YES/NO)");
			this._nextState(conversation, "save", "Looks like we're all set.");
		}
		if (conversation.state == 'save'){
			if(text.indexOf("YES")>-1){
				this.bot.share("Cool. We're doing this.");
				this.bot.persistence.insertTrainingSession(conversation.data, function(session, err){
					if (err){
						this.bot.share("I couldn't save the session: "+err);
					} else {
						this.bot.share("The training session: \""+session.title+"\" was created.");
						console.log(session);
					}
         		});
				this.bot.conversationManager.endConversation(conversation);
			} else {
				this.bot.share("Ok... Let me know when you decide to go for it.");
			}
		}

	},
	_nextState: function (conversation, nextState, userQuery){
		var that = this;
		this.bot.conversationManager.changeConversationState(conversation, nextState, function(){
			that.bot.share(userQuery);
		});
	}
}	

module.exports = CreateTrainingSessionConversationHandler;
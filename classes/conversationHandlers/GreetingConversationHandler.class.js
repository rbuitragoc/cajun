var GreetingConversationHandler = function(bot){
	this.bot = bot;
}

GreetingConversationHandler.prototype = {
	handle: function (from, text, conversation){
		var handler = this;
		console.log('Handling {'+conversation.topic+'} with {'+from+'}, he said "'+text+'". State is {'+conversation.state+'}');
		if (conversation.state == 'waitingForMood'){
			if (text.indexOf("good") != -1){
				this.bot.share('Awesome, I feel great as well!');
				this.bot.conversationManager.changeConversationState(conversation, 'project', function(){
					handler.bot.share('What project are you in by the way??');
				});
			} else if (text.indexOf("sad") != -1){
				this.bot.conversationManager.changeConversationState(conversation, 'sadnessReason', function(){
					handler.bot.share('Whosh... why is that?');
				});
			} else {
				this.bot.share('Huh? Are you feeling good or sad today?');
			}
		} else if (conversation.state == 'sadnessReason'){
			this.bot.share(from+', that\'s no reason to be sad, cheer up!')
			this.bot.conversationManager.endConversation(conversation);
		} else if (conversation.state == 'project'){
			this.bot.share('Ah, that one\'s pretty cool!')
			this.bot.conversationManager.setConversationData(conversation, 'project', text, function(){});
			this.bot.conversationManager.changeConversationState(conversation, 'needSomething', function(){
				handler.bot.share('Do you need something from me?')
			});
		} else if (conversation.state == 'needSomething'){
			if (text.indexOf("yes") != -1 || text.indexOf("no") != -1){
				this.bot.share('Ok! Just ask if you need anything... I\'ll be around! ;)')
				var project = conversation.data.project;
				this.bot.share('By the way, good luck with '+project+'\'s development, you are going to need it!')
				this.bot.conversationManager.endConversation(conversation);
			}  else {
				this.bot.share('Huh? Do you need something from me? (yes or no)')
			}
		}
	}
}

module.exports = GreetingConversationHandler;
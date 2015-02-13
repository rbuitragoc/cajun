var ConversationManager = function(bot){
	this.bot = bot;
};

ConversationManager.prototype =  {
	getCurrentConversations: function(person, callback){
		this.bot.persistence.getConversations(person, callback);
	},
	startConversation: function(person, topic, initialState, callback, resumeCallback){
		var manager = this;
		this.bot.persistence.getConversation(topic, person, function(err, conversation){
			if (conversation){
				if (resumeCallback){ 
					resumeCallback(conversation);
				}
			} else {
				var conversationData = {
					topic: topic,
					withPlayer: person,
					state: initialState,
					data: {},
					startedOn: new Date().formatYYYYMMDD()
				}
				manager.bot.persistence.insertConversation(conversationData, function(result, err){
					if (!err){
						callback();
					}
				})
			}
		});
	},
	endConversation: function(conversation, callback){
		this.bot.persistence.deleteConversation(conversation.topic, conversation.withPlayer, function(result, err){
			if (!err) {
				if (callback) {
					callback();
				}
			} else {
				console.log(err);
			}
		})
	},
	changeConversationState: function(conversation, newState, callback){
		this.bot.persistence.updateConversation(conversation.topic, conversation.withPlayer, {$set: {state: newState}}, function(result, err){
			if (!err) {
				callback();
			} else {
				console.log(err);
			}
		})
	},
	setConversationData: function(conversation, key, value, callback){
		var setModifier = { $set: {} };
		setModifier.$set['data.' + key] = value;
		this.bot.persistence.updateConversation(conversation.topic, conversation.withPlayer, setModifier, function(result, err){
			if (!err) {
				callback();
			} else {
				console.log(err);
			}
		})
	}
};

module.exports = ConversationManager;

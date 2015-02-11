var ConversationManager = function(){
};

ConversationManager.prototype =  {
	getCurrentConversations: function(person, callback){
		callback(false, []);
	}
};

module.exports = ConversationManager;

var CommandConversationHandler = require('./../../../classes/conversationHandlers/CommandConversationHandler.class');

describe("A command conversation", function() {
	describe("A give points conversation", function() {

		var bot, command;
		beforeEach( function(){
			bot = {
				share: jasmine.createSpy('share'),
				collaborationManager: {
					givePoints: jasmine.createSpy('givePoints')
				},
				connector:{
					slackChannel:{
						name:'any'
					}
				},
				config:{
					maxCollabPoints: 10
				}
			};
			command = new CommandConversationHandler(bot);
		});

		it("give 1 point", function() {
			command.handle('jhon_doe', 'give 1 point to somebody');
			expect(bot.collaborationManager.givePoints)
				.toHaveBeenCalledWith(jasmine.objectContaining({
					fromPlayerName: 'jhon_doe',
					toPlayerName: 'somebody',
					collabPoints: 1
				}), bot);
		});
		it("give 10 points", function() {
			command.handle('jhon_doe', 'give 10 points to somebody');
			expect(bot.collaborationManager.givePoints)
				.toHaveBeenCalledWith(jasmine.objectContaining({
					fromPlayerName: 'jhon_doe',
					toPlayerName: 'somebody',
					collabPoints: 10
				}), bot);
		});
		it("give points with at(@)", function() {
			command.handle('jhon_doe', 'give 1 point to @somebody');
			expect(bot.collaborationManager.givePoints)
				.toHaveBeenCalledWith(jasmine.objectContaining({
					toPlayerName: 'somebody'
				}), bot);
		});
		it("shows an error on 1 point but plural", function() {
			command.handle('jhon_doe', 'give 1 points to somebody');
			expect(bot.share).toHaveBeenCalledWith("Sorry, I didn't understand one point? multiple points?");
		});
		it("shows an error on 10 points but singular", function() {
			command.handle('jhon_doe', 'give 10 point to somebody');
			expect(bot.share).toHaveBeenCalledWith("Sorry, I didn't understand one point? multiple points?");
		});
		it("shows an error on points isn't integer", function() {
			command.handle('jhon_doe', 'give what point to somebody');
			expect(bot.share).toHaveBeenCalledWith("Sorry, I didn't understand that..");
		});
		it("shows an error self assigning points", function() {
			command.handle('jhon_doe', 'give 1 point to jhon_doe');
			expect(bot.share).toHaveBeenCalledWith("Really? are you trying to assign points to yourself? I cannot let you do that, buddy");
		});
	});
});
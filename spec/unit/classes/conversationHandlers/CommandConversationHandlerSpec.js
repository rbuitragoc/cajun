require('./../../../support/setBasicCalls')('classes/conversationHandlers', 'CommandConversationHandler');
var channel = 'somechannel';
describe("A command conversation", function() {
	describe("A give points conversation", function() {

		var bot, command;
		beforeEach( function(){
			bot = CommandConversationHandlerMocks.bot;
			command = new CommandConversationHandler(bot);
		});

		it("give 1 point", function() {
			command.handle('jhon_doe', 'give 1 point to somebody', channel);
			expect(bot.collaborationManager.givePoints)
				.toHaveBeenCalledWith(jasmine.objectContaining({
					fromPlayerName: 'jhon_doe',
					toPlayerName: 'somebody',
					collabPoints: 1
				}), bot);
		});

		it("give 10 points", function() {
			command.handle('jhon_doe', 'give 10 points to somebody', channel);
			expect(bot.collaborationManager.givePoints)
				.toHaveBeenCalledWith(jasmine.objectContaining({
					fromPlayerName: 'jhon_doe',
					toPlayerName: 'somebody',
					collabPoints: 10
				}), bot);
		});

		it("give points with at(@)", function() {
			command.handle('another_jhon_doe', 'give 1 point to <@U03PY6S5F>', channel);
			expect(bot.collaborationManager.givePoints)
				.toHaveBeenCalledWith(jasmine.objectContaining({
					toPlayerName: 'jhon_doe'
				}), bot);
		});

		it("shows an error on 1 point but plural", function() {
			command.handle('jhon_doe', 'give 1 points to somebody', channel);
			expect(bot.shareOn).toHaveBeenCalledWith(channel, "Sorry, I didn't understand one point? multiple points?");
		});

		it("shows an error on 10 points but singular", function() {
			command.handle('jhon_doe', 'give 10 point to somebody', channel);
			expect(bot.shareOn).toHaveBeenCalledWith(channel, "Sorry, I didn't understand one point? multiple points?");
		});

		/*it("shows an error on points isn't integer", function() {
			command.handle('jhon_doe', 'give whatever point to somebody', channel);
			expect(bot.shareOn).toHaveBeenCalledWith(channel, "Sorry, I didn't understand that..");
		});*/

		it("shows an error self assigning points", function() {
			command.handle('jhon_doe', 'give 1 point to jhon_doe', channel);
			expect(bot.shareOn).toHaveBeenCalledWith(channel, "Really? are you trying to assign points to yourself? I cannot let you do that, buddy");
		});

        it("shows an error assigning points to bots", function() {
            command.handle('jhon_doe', 'give 1 point to collabot', channel);
            expect(bot.shareOn).toHaveBeenCalledWith(channel, "Great to get some love from you, jhon_doe. But, as a robot, I'm based on rules, and rules say I cannot get or give points. Thanks anyway!");
        });
	});
	describe("A request a report conversation", function() {
		beforeEach( function(){
			bot = CommandConversationHandlerMocks.bot
			command = new CommandConversationHandler(bot)
			it("Refuse to request a report", function() {
				command.handle('juan_perez', 'report', channel)
				
			})
		});
	})
});
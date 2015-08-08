function Cajunbot(config){
  this.version = config.version;
  this.config = config;
  this.connector = new config.connector(config);
  this.persistence = new config.persistence(config);
  this.guid = null;
}

//TODO: This should be moved out of global scope
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

module.exports = Cajunbot;

// Managers 
var CollaborationManager = require('./CollaborationManager.class');
var ConversationManager = require('./managers/ConversationManager.class');
var ReportManager = require('./managers/ReportManager.class')
var SchedulingManager = require('./managers/SchedulingManager.class')
var DateUtils = require('./util/DateUtils.class')

// Conversation Handlers
var DefaultConversationHandler = require('./conversationHandlers/DefaultConversationHandler.class')
var CommandConversationHandler = require('./conversationHandlers/CommandConversationHandler.class')
var GreetingConversationHandler = require('./conversationHandlers/GreetingConversationHandler.class')
var ReportConversationHandler = require('./conversationHandlers/ReportConversationHandler.class')

// Utility Classes
var mentionCheck = require('./util/ChatUtils.class');

// External Libs
var async = require('async');

Cajunbot.prototype = {
  start: function(callback){
    if (this.guid) {
      callback("running");
    } else {
      this.persistence.init();
      this.connector.init(this);
      this.collaborationManager = new CollaborationManager();
      this.conversationManager = new ConversationManager(this);
			this.reportManager = new ReportManager(this)
      this.schedulingManager = new SchedulingManager(this)
      this.commandConversationHandler = new CommandConversationHandler(this);
      this.defaultConversationHandler = new DefaultConversationHandler(this);
      this.handlers = {
        greeting: new GreetingConversationHandler(this),
				report: new ReportConversationHandler(this)
      }
      this.guid = guid();
      this.loadReminders();
      callback("started");
    }   
  },
  stop: function(callback){
    if(this.guid){
      this.connector.logout();
      this.guid = null;
      this.persistence = null;
      this.collaborationManager = null;
      this.conversationManager = null;
			this.reportManager = null
      this.schedulingManager = null
      callback("stopped");
    } else {
      callback("nothing to stop")
    }   
  },
  channelJoined: function(channel, who){
    
  },
  message: function(from, text, channel){
    try {
      if (!text)
        return;
      var wasMentioned = mentionCheck(this.config.botName, text)
      if (wasMentioned) {
        this.commandConversationHandler.handle(from, text, channel);
      } else {
        this.defaultConversationHandler.handle(from, text, channel);
      }
      var bot = this;
      this.conversationManager.getCurrentConversations(from, function(error, conversations){
        if (error){
          console.log("Error obtaining current conversations: "+error)
          return;
        }
        try {
          console.log(conversations);
          for (var i = 0; i < conversations.length; i++){
            var handler = bot.handlers[conversations[i].topic];
            if (handler){
              handler.handle(from, text, conversations[i]);
            }
          }
        } catch (err){
          bot.share('Whoopsie! '+err);
          console.log(err.stack);
        }
      });
    } catch (err){
      this.share('Whoopsie! '+err);
      console.log(err.stack);
    }
  },
  say: function(who, text){
    this.connector.say(who, text);
  },
  share: function(text){
    this.connector.share(text);
  },
  shareOn: function(place, text) {
    if (place)
      this.connector.shareOn(place, text);
    console.log("[Sharing on other channel/group] '%s'",text)
  },
	smartSay: function(to, message) {
		var userObject = this.connector.findUserByName(to)
		if (userObject) {
			console.log("[SmartSay] to whom? Got the wonderful user %s", userObject.id)

			if (userObject.id.indexOf('U') == 0) {
				console.log("[SmartSay] destination is an user, will try to 'say' instead of share")
				this.say(to, message)
			} 
		} else {
			console.log("Cannot identify the kind of destination for named destination '%s'. Will try 'shareOn', hoping for the best!", to)
			this.shareOn(to, message)
		}
	},	
  registerPlayers: function(players, welcomeFunction) {
    console.log("These are all the slack users reported by Slack API for the team: [%s]. \nAttempting to check whether there's new slack users...", players)
    var that = this
    async.each(players, 
      function(player, callback) {
				that.registerPlayer(player, callback)
			}, function(err) {
        if (err) console.error(err)
				console.log("... done checking users registry! All set!\n")
				welcomeFunction()
      }
		);
		
  },
  registerPlayer: function(player, callback) {
    var that = this;
    that.persistence.getPlayerByName(player, function(user, err) {
      if (err) {
        console.log("Error getting player");
        console.error(err);
      } else if (!user) {
        that.persistence.insertNewPlayer(player, function(inserted, err) {
          if (err) {
            console.log(err.stack);
          } else {
            // new user
          }
        });
      } else {
        // existing user
      }
			callback()
    });   
  },
  loadReminders : function () {
    var db = this.persistence,
        bot = this;

    var reminders = db.getReminders(
      function (err, result) {
        //console.log('result:', result, 'err:', err);

        for(var ndx in result){
          var reminder = result[parseInt(ndx)];
          var expired = DateUtils.hasPassedTimestamp(reminder.date);
              // delete the reminder if expired
          if (expired) {
            // deleting from array
            result.splice(result.indexOf(reminder), 1);
            // deleting from db
            db.deleteReminder(reminder._id, function (err, result) {
              if (typeof err !== 'undefined') {
                console.log(err, result)
              };
                
              if (typeof result !== 'undefined') {
                console.log(result);
              };
            });
          }
          // Load the reminders
          if (typeof reminder.dm !== 'undefined') DateUtils.scheduleAndSay(reminder.cronspec, bot, reminder.dm, reminder.text);
          if (typeof reminder.channel !== 'undefined') DateUtils.scheduleAndShare(reminder.cronspec, bot, reminder.channel, reminder.text);
        };

      }
    );
  },
	about: function() {
		return "ID ["+this.guid+"] - I am "+this.config.botName+" version "+this.version+". I'm running on "+this.config.environment+" using the "+this.connector.name+" interactivity connector and the "+this.persistence.name+" persistance connector."
	}
}

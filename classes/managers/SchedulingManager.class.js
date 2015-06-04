var DateUtils = require('../util/DateUtils.class')

var SchedulingManager = function(bot) {
	this.bot = bot
	this.schedulingManager = this.bot.config.schedulingManager
}

SchedulingManager.prototype = {
	scheduleRegisterToSessionReminder: function(sessionData, regionData) {
		
		var registerConfig = this.bot.config.edserv.reminders.register;
		
		// take bot.config and read the REGISTRATION_THRESHOLD parameter or default to 24h
		var registerBefore = (registerConfig)? registerConfig.hours: 24
		
		// use the date from the just created training session
		var date = new Date().fromExpressions(sessionData.desiredDate, sessionData.time)
		console.log("Getting the date from the sessionData: %s", date)
		
		// subtract the desired hours
		var reminderDate = date.subtractHours(registerBefore)
		console.log("Getting the date after subtracting the hours: %s", reminderDate)
		
		// create a cronspec 
		var cronspec = reminderDate.getCronspec()
		console.log("Calculated cronspec: [%s]", cronspec)
		
		// call _schedule
		var text = "Remember to register to the upcoming '"+sessionData.title+"' session, by "+sessionData.presenter+". It'll take place in "+sessionData.location+", on "+sessionData.desiredDate+",  "+sessionData.time+" ("+sessionData.duration+" h). You can talk to "+this.bot.config.botName+" and ask about 'upcoming sessions', or 'help' if you need any more information."
		// TODO implement RegionDataManager as per https://trello.com/c/7XBXBYQN
		var schedObject = DateUtils.scheduleAndShare(cronspec, this.bot, text, regionData.groups[0]);
		// TODO persist scheduled event (resilience)
		
		var callback = function (result, err) {
			console.log(result, err);
		};
		
		var reminderSaving = this.bot.persistence.insertReminder({cronspec : cronspec, channel : this.bot.config.channel, text : text}, callback);
	}, 
	scheduleAttendToSessionReminder: function(sessionData, requestor) {
		
		// take bot.config and read the EVENT_THRESHOLD parameter or default it to 20h
		var attendConfig = this.bot.config.edserv.reminders.attend;
		var attendHours = (attendConfig)? attendConfig.hours: 20
		
		// use the date from the just created training session, subtracting the desired hours
		var date = new Date().fromExpressions(sessionData.desiredDate, sessionData.time).subtractHours(attendHours)
		
		// create a cronspec
		var cronspec = date.getCronspec()
		console.log('Calculated cronspec: [%s]', cronspec)
		
		// call _schedule
		var text = "Remember, you're registered to '"+sessionData.title+"' session, by "+sessionData.presenter+". We expect to see you in "+sessionData.location+", on "+sessionData.desiredDate+",  "+sessionData.time+"."
		
		var scheduleObject = DateUtils.scheduleAndSay(cronspec, this.bot, requestor, text);
		
		// persist scheduled event (resilience)
		console.log("scheduleAttendToSessionReminder with date '%s' as requested by %s", date, requestor)

		// Save reminder in db.reminders
		var callback = function (result, err) {
			console.log(result, err);
		};
		
		var reminderSaving = this.bot.persistence.insertReminder({cronspec : cronspec, dm : requestor, text : text}, callback);
	},
	scheduleRateAttendedSessionReminder: function(sessionData, requestor) {
		// take bot.config and read:
		var rateConfig = this.bot.config.edserv.reminders.rate;
		//	RATING_THRESHOLD or default to 1h
		var rateHours = (rateConfig)? rateConfig.hours: 1
		//	RATING_REMINDER_PERIOD or default to null (no op)
		var retryIntervalHours = (rateConfig && rateConfig.retry)? rateConfig.retry.intervalHours: null
		//	RATING_REMINDER_REPETITIONS or default to null (no op)
		var retryTimes = (rateConfig && rateConfig.retry)? rateConfig.retry.times: null
		
		// use date parameter
		var date = new Date().fromExpressions(sessionData.desiredDate, sessionData.time)
		var afterEvent = (rateConfig && rateConfig.afterEvent)? rateConfig.afterEvent: false
		date = (afterEvent)? date.addHours(rateHours): date.subtractHours(rateHours)
		// TODO config recurrent reminders, check for nulls to disable
		
		// create a cronspec
		var cronspec = date.getCronspec()
		console.log("Calculated cronspec: [%s]", cronspec)
		
		// call _schedule
		var text = "Remember to rate this training you've attended: '" + sessionData.title + "'. Please ask "+this.bot.config.botName+" via DM: 'rate session' and choose this training to complete the evaluation. Thanks!"
		
		console.log("scheduleRateAttendedSessionReminder with date '%s' as requested by '%s'", date, requestor)
		var scheduleObject = DateUtils.scheduleAndSay(cronspec, this.bot, requestor, text)
		// TODO persist scheduled event
 
		// Save reminder in db.reminders
		var callback = function (result, err) {
			console.log(result, err);
		};
		
		var reminderSaving = this.bot.persistence.insertReminder({cronspec : cronspec, dm : requestor, text : text}, callback);
	},
	schedule: function(cronspec, requestor) {
		console.log("Scheduling something for %s", requestor)
		DateUtils.schedule(cronspec)
	}
}

module.exports = SchedulingManager
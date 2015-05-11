var DateUtils = require('../util/DateUtils.class')

var SchedulingManager = function(bot) {
	this.bot = bot
	this.schedulingManager = this.bot.config.schedulingManager
}

SchedulingManager.prototype = {
	scheduleRegisterToSessionReminder: function(sessionData) {
		
		// take bot.config and read the REGISTRATION_THRESHOLD parameter or default to 24h
		var registrationThreshold = (this.bot.config.edserv.thresholds.registration)? this.bot.edserv.thresholds.registration: 24
		
		// use the date from the just created training session
		var date = new Date().fromExpressions(sessionData.desiredDate, sessionData.time)
		console.log("Getting the date from the sessionData: %s", date)
		
		// subtract the desired hours
		var reminderDate = date.subtractHours(registrationThreshold)
		console.log("Getting the date after subtracting the hours: %s", reminderDate)
		
		// create a cronspec 
		var cronspec = reminderDate.getCronspec()
		console.log("Calculated cronspec: [%s]", cronspec)
		
		// call _schedule
		var text = "Remember to register to the upcoming '"+sessionData.title+"' session, by "+sessionData.presenter+". It'll take place in "+sessionData.location+", on "+sessionData.desiredDate+",  "+sessionData.time+" ("+sessionData.duration+" h). You can talk to "+this.bot.config.botName+" and ask about 'upcoming sessions', or 'help' if you need any more information."
		var schedObject = DateUtils.scheduleAndShare(cronspec, this.bot, text) 
		// TODO persist scheduled event (resilience)
	}, 
	scheduleAttendToSessionReminder: function(sessionData, requestor) {
		
		// take bot.config and read the EVENT_THRESHOLD parameter or default it to 20h
		var edservConfig = this.bot.config.edserv;
		var eventThreshold = (edservConfig.thresholds.attend)? edservConfig.thresholds.attend: 20
		
		// use the date from the just created training session, subtracting the desired hours
		var date = new Date().fromExpressions(sessionData.desiredDate, sessionData.time).subtractHours(eventThreshold)
		
		// create a cronspec
		var cronspec = date.getCronspec()
		console.log('Calculated cronspec: [%s]', cronspec)
		
		// call _schedule
		var text = "Remember, you're registered to '"+sessionData.title+"' session, by "+sessionData.presenter+". We expect to see you in "+sessionData.location+", on "+sessionData.desiredDate+",  "+sessionData.time+"."
		var schedObject = DateUtils.scheduleAndSay(cronspec, bot, requestor, text)
		
		// persist scheduled event (resilience)
		console.log("TODO: scheduleAttendToSessionReminder with date '%s' as requested by %s", date, requestor)
	},
	scheduleRateAttendedSessionReminder: function(sessionData, requestor) {
		// take bot.config and read:
		//	RATING_THRESHOLD or default to 1h
		var edservConfig = this.bot.config.edserv;
		var ratingThreshold = (edservConfig.thresholds.rating)? edservConfig.thresholds.rating: 1
		//	RATING_REMINDER_PERIOD or default to 24h
		// var ratingReminderPeriod = (this.bot.config.ratingReminderPeriod)? this.bot.config.ratingReminderPeriod: 24
		//	RATING_REMINDER_REPETITIONS or default to 5
		// var ratingReminderRepetitions = (this.bot.config.ratingReminderRepetitions)? this.bot.config.ratingReminderRepetitions: 5
		
		// use date parameter
		var date = new Date().fromExpressions(sessionData.desiredDate, sessionData.time).subtractHours(-ratingThreshold)
		
		// create a cronspec
		var cronspec = date.getCronspec()
		console.log("Calculated cronspec: [%s]", cronspec)
		
		// call _schedule
		// TODO persist scheduled event
		console.log("TODO: scheduleRateAttendedSessionReminder with date '%s' as requested by '%s'", date, requestor)
	},
	schedule: function(cronspec, requestor) {
		console.log("Scheduling something for %s", requestor)
		DateUtils.schedule(cronspec)
	}
}

module.exports = SchedulingManager
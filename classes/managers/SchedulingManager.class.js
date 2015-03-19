var DateUtils = require('../util/DateUtils.class')

var SchedulingManager = function(bot) {
	this.bot = bot
	this.schedulingManager = this.bot.config.schedulingManager
}

SchedulingManager.prototype = {
	scheduleRegisterToSessionReminder: function(date, requestor) {
		// take bot.config and read the REGISTRATION_THRESHOLD parameter or default to 24h
		var registrationThreshold = (this.bot.config.registrationThreshold)? this.bot.registrationThreshold: 24
		// subtract the desired hours
		var reminderDate = date.subtractHours(registrationThreshold)
		// create a cronspec 
		var cronspec = reminderDate.getCronspec()
		console.log("Calculated cronspec: [%s]", cronspec)
		// call _schedule
		var sched = DateUtils.simpleSchedule(cronspec)
		// TODO persist scheduled event (resilience)
	}, 
	scheduleAttendToSessionReminder: function(date, requestor) {
		// take bot.config and read the EVENT_THRESHOLD parameter or default it to 20h
		// create a cronspec
		// use date parameter
		// call _schedule
		// persist scheduled event (resilience)
		console.log("TODO: scheduleAttendToSessionReminder with date '%s' as requested by %s", date, requestor)
	},
	scheduleRateAttendedSessionReminder: function(date, requestor) {
		// take bot.config and read:
		//	RATING_THRESHOLD or default to 1h
		//	RATING_REMINDER_PERIOD or default to 24h
		//	RATING_REMINDER_REPETITIONS or default to 5
		// create a cronspec
		// use date parameter
		// call _schedule
		// persist scheduled event
		console.log("TODO: scheduleRateAttendedSessionReminder with date '%s' as requested by '%s'", date, requestor)
	},
	schedule: function(cronspec, requestor) {
		console.log("Scheduling something for %s", requestor)
		DateUtils.schedule(cronspec)
	}
}

module.exports = SchedulingManager
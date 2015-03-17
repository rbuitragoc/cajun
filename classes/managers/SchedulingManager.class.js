var later = require('later')

var SchedulingManager = function(bot) {
	this.bot = bot
	this.schedulingManager = this.bot.config.schedulingManager
	later.date.localTime()
}

SchedulingManager.prototype = {
	scheduleRegisterToSessionReminder: function(date, requestor) {
		// take bot.config and read the REGISTRATION_THRESHOLD parameter or default to 24h
		// create a cronspec 
		// use date passed by parameter
		// call _schedule
		// persist scheduled event (resilience)
		console.log("TODO: scheduleRegisterToSessionReminder with date '%s' as requested by %s", date, requestor)
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
	}
	_schedule: function(cronspec, date, requestor) {
		this._schedule_later(cronspec, date, requestor)
	},
	_schedule_later: function(cronspec, date, requestor) {
		var cronsched = later.parse.cron(cronspec)
		var sched = later.schedule(cronsched),
				start = date
		
		//console.log(sched.next(1, start))
	}
}

module.exports = SchedulingManager
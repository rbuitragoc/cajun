var later = require('later')

Date.prototype.formatYYYYMMDD = function() {
	var month = this.getUTCMonth() + 1;
	var day = this.getUTCDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	return this.getUTCFullYear() + "-" + month + "-" + day;
}

Date.prototype.getWeek = function() {
	var onejan = new Date(this.getUTCFullYear(),0,1);
	return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
}

Date.prototype.subtractHours = function(hours) {
	var subtractMillis = hours * 60 * 60 * 1000
	this.setMilliseconds(this.getMilliseconds() - subtractMillis)
	return this
}

Date.prototype.getCronspec = function(interval, repetitions) {
	if (interval || repetitions) {
		// Setting the interval is as easy as creating a spec with the form
		// 0 0 0/24 X X ? 
		// , where clearly the interval defines the repetitions every 24h (in this example)
		// To fully implement recurrent reminders to rate training sessions we need: 
		// 1. Control Repetitions. As this needs to be fired up to $repetitions times,
		// we have to carry around the count per user/training (?), and probably
		// want to assert (at the manager level, of course) if the user hasn't actually rated the training.
		return null	
	} else {
		// Why not using UTC values? The main reason is that those timers are configured to use local time!
		var cronspec = '' + this.getSeconds()
									+ ' ' + this.getMinutes()
									+ ' ' + this.getHours()
									+ ' ' + this.getDate()
									+ ' ' + (this.getMonth()+1)
									+ ' ?'
		return cronspec
	}
}

Date.prototype.fromExpressions = function(dateExpression, timeExpression) {
	this.setDateFromExpression(dateExpression)
	this.setTimeFromExpression(timeExpression)
	return this
}

Date.prototype.setDateFromExpression = function(text) {
	var splitText = text.split('\/')
	if (splitText && splitText.length == 3) {
		this.setFullYear(splitText[0])
		this.setMonth(splitText[1])
		// user is entering months counting from 1 (Jan is 1, Feb is 2, and so on)
		this.setMonth(this.getMonth()-1)
		this.setDate(splitText[2])
		// resetting other fields to 0
		this.setHours(0)
		this.setMinutes(0)
		this.setSeconds(0)
		this.setMilliseconds(0)
	}
}

Date.prototype.setTimeFromExpression = function(text) {
	var splitText = text.split('\:')
	if (splitText && splitText.length == 2) {
		this.setHours(splitText[0])
		this.setMinutes(splitText[1])
	}
}

module.exports = {
	getCurrentDate: function(){
		var date = new Date();
		return {
			day: date.getUTCDate(),
			month: date.getUTCMonth() + 1,
			year: date.getUTCFullYear(),
			week: date.getWeek()
		}
	},
	getLastWeekOf: function(year){
		var date = new Date(year+1, 0, 1, 1, 0, 0, 0);
		date.setDate(0);
		return date.getWeek();
	},
	simpleSchedule: function(spec) {
		later.date.localTime()
		var scheduleconfig = later.parse.cron(spec, true)
		var sched = later.schedule(scheduleconfig),
				start = new Date()
				next = sched.next(2, start)
		console.log('\tSCHEDULED EVENT. Using [%s] as cronspec, and calculating from startdate [%s] Next (2) occurence(s): %s', spec, start, next)
		return sched
	},
	simpleScheduleAndExecute: function(spec, action) {
		later.date.localTime()
		var scheduleconfig = later.parse.cron(spec, true)
		var sched = later.schedule(scheduleconfig)
		var	timeout = later.setTimeout(action, scheduleconfig)
		console.log('\tA timeout for an event has been set. Schedule ready [%s], Timeout ready [%s]', sched, timeout)
		return {schedule: sched, timer: timeout}
	},
	scheduleAndShare: function(spec, bot, text) {
		later.date.localTime()
		var scheduleConfig = later.parse.cron(spec, true)
		var sched = later.schedule(scheduleConfig)
		var timeout = later.setTimeout(function() {bot.share(text)}, scheduleConfig)
		console.log('\tA timeout for an event has been set. Schedule ready [%s], and will share the following text on channel #%s: %s', sched, bot.config.channel, text)
		return {schedule: sched, timer: timeout}
	},
	scheduleAndSay: function(spec, bot, to, text) {
		later.date.localTime()
		var scheduleConfig = later.parse.cron(spec, true)
		var sched = later.schedule(scheduleConfig)
		var timeout = later.setTimeout(function() {bot.say(to, text)}, scheduleConfig)
		console.log('\tA timeout for an event has been set. Schedule ready [%s], and will say to %s the following: %s', sched, to, text)
		return {schedule: sched, timer: timeout}
	}
}

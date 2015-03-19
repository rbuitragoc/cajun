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

Date.prototype.getCronspec = function() {
	var cronspec = '' + this.getSeconds()
								+ ' ' + this.getMinutes()
								+ ' ' + this.getHours()
								+ ' ' + this.getUTCDate()
								+ ' ' + (this.getUTCMonth()+1)
								+ ' ?'
	return cronspec
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
	scheduleAndExecute: function(spec, action) {
		later.date.localTime()
		var scheduleconfig = later.parse.cron(spec, true)
		var sched = later.schedule(scheduleconfig)
		var	timeout = later.setTimeout(action, scheduleconfig)
		console.log('\tA timeout for an event has been set. Schedule ready [%s], Timeout ready [%s]', sched, timeout)
		return {schedule: sched, timer: timeout}
	}
}

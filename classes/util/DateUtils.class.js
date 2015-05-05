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
	// Why not using UTC values? The main reason is that those timers are configured to use local time!
	var cronspec = '' + this.getSeconds()
								+ ' ' + this.getMinutes()
								+ ' ' + this.getHours()
								+ ' ' + this.getDate()
								+ ' ' + (this.getMonth()+1)
								+ ' ?'
	return cronspec
}

Date.prototype.hasPassed = function(eventDate) {
	if (!eventDate) eventDate = new Date()
	return this < eventDate;
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
	}
}

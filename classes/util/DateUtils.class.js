Date.prototype.formatYYYYMMDD = function() {
	var month = this.getUTCMonth() + 1;
	var day = this.getUTCDay() + 1;
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

module.exports = {
	getCurrentDate: function(){
		var date = new Date();
		return {
			day: date.getUTCDay() + 1,
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

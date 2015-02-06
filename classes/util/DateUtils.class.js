Date.prototype.formatYYYYMMDD = function() {
	var month = this.getMonth() + 1;
	var day = this.getDay() + 1;
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	return this.getUTCFullYear() + "-" + month + "-" + day;
}
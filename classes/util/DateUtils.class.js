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
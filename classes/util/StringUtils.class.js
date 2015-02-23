module.exports = {
	isMatch: function(regexes, text) {
		for (var i = 0; i < regexes.length; i++) {
			var regex = regexes[i];
			if (regex.exec(text)) {
				return true;
			}
		}
		return false;
	},
	isNumber: function(text) {
		return /^\d+$/.exec(text);
	}
}
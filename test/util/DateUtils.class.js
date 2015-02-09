var assert = require('assert');
var DateUtils = require('../../classes/util/DateUtils.class');

function testFormatYYYYMMDD() {
	var year = 2015,
		month = 1,
		day = 15;
	var anyGivenDateString = year + '-0' + month + '-' + day;
	var date = new Date(year, month-1, day-1);

	assert.equal(date.formatYYYYMMDD(), anyGivenDateString, 'Failed assertion! Never equal!');
}

module.exports = {
	testFormat: testFormatYYYYMMDD
}
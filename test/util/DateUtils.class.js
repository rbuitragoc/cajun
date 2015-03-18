var assert = require('assert');
var DateUtils = require('../../classes/util/DateUtils.class');

function testFormatYYYYMMDD() {
	var year = 2015,
		month = 1,
		day = 15;
	var anyGivenDateString = year + '-0' + month + '-' + day;
	var date = new Date(year, month-1, day);
	assert.equal(date.formatYYYYMMDD(), anyGivenDateString, 'Failed assertion! Never equal!');
}

function testSubtractHours() {
	var currentDate = new Date('2015-03-17')
	var day = currentDate.getDate()
	var before = currentDate.subtractHours(24)
	console.log('testSubtractHours(): comparing day %s with day %s', day-1, before.getDate())
	assert.equal(day-1, before.getDate(), 'Failed assertion! The date is not the same!')
}

function testGetCronspec() {
	var currentDate = new Date(2015, 2, 17, 0, 0, 0)
	var expected = '0 0 0 17 3 ?'
	var cronspec = currentDate.getCronspec()
	console.log("testGetCronspec(): created cronspec [%s], expecting [%s]", cronspec, expected)
	assert.equal(expected, cronspec, "Failed! cronspecs aren't equal")
}

function testSimpleSchedule() {
	var aDate = new Date(2015, 2, 20, 13, 30, 0)
	var spec = aDate.getCronspec()
	var sched = DateUtils.simpleSchedule(spec)
	console.log("testSimpleSchedule(): aDate: [%s], spec [%s]SCHEDULE, sched [%s]", aDate, spec, sched.isValid(aDate))
	assert(sched.isValid(aDate))
}

module.exports = {
	testFormat: testFormatYYYYMMDD,
	testSubtractHours: testSubtractHours,
	testGetCronspec: testGetCronspec,
	testSchedule: testSimpleSchedule
}
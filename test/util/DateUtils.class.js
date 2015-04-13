var assert = require('assert');
var DateUtils = require('../../classes/util/DateUtils.class');
var Collabot = require('../Collabot.Mock.class')

var mockBot = new Collabot()
mockBot.config = {
	channel: "anyChannel"
}

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
	var neg = -36
	var after = currentDate.subtractHours(neg)
	console.log("testSubtractHours(): using a negative value (%d), comparing day %s with day %s", neg, day+1, after.getDate())
	assert.equal(day+1, after.getDate(), 'Failed assertion! date is not the same!')
}

function testGetCronspec() {
	var currentDate = new Date(2015, 2, 17, 0, 0, 0)
	var expected = '0 0 0 17 3 ?'
	var cronspec = currentDate.getCronspec()
	console.log("testGetCronspec(): created cronspec [%s], expecting [%s]", cronspec, expected)
	assert.equal(expected, cronspec, "Failed! cronspecs aren't equal")
}

function testDateConstruction() {
	var currentDate = new Date(2015, 2, 23, 8, 30, 0)
	var dateExpression = '2015/03/23'
	var timeExpression = '8:30'
	var expectedDate = new Date().fromExpressions(dateExpression, timeExpression)
	console.log("testDateConstruction(): attempting to compare date [%s] with [%s] which was created from expressions %s and %s", currentDate, expectedDate, dateExpression, timeExpression)
	assert.equal(currentDate.getYear(), expectedDate.getYear(), "year!")
	assert.equal(currentDate.getMonth(), expectedDate.getMonth(), "month!")
	assert.equal(currentDate.getDate(), expectedDate.getDate(), "date!")
	assert.equal(currentDate.getHours(), expectedDate.getHours(), "hours!")
	assert.equal(currentDate.getMinutes(), expectedDate.getMinutes(), "minutes!")
	assert.equal(currentDate.getSeconds(), expectedDate.getSeconds(), "seconds!")
}

function testSetDateFromExpression() {
	var expectedDate = new Date(2015, 2, 23)
	var actualDate = new Date()
	var expression = '2015/03/23'
	actualDate.setDateFromExpression(expression)
	console.log("testSetDateFromExpression(): trying to compare expected date [%s] and actualDate [%s], the latter being set by expression %s", expectedDate, actualDate, expression)
	assert.equal(expectedDate.getFullYear(), actualDate.getFullYear(), "years aren't equal")
	assert.equal(expectedDate.getMonth(), actualDate.getMonth(), "months aren't equal")
	assert.equal(expectedDate.getDate(), actualDate.getDate(), "dates aren't equal")
	// also asserting the other fields are resetted to 0
	assert.equal(expectedDate.getHours(), 0, "hours field hasn't been resetted!")
	assert.equal(expectedDate.getMinutes(), 0, "minutes field hasn't been resetted!")
	assert.equal(expectedDate.getSeconds(), 0, "seconds field hasn't been resetted!")
	assert.equal(expectedDate.getMilliseconds(), 0, "milliseconds field hasn't been resetted!")
}

function testSetTimeFromExpression() {
	var expectedDate = new Date(2015, 2, 23, 8, 30, 0)
	var actualDate = new Date("2015-03-23")
	var expression = '8:30'
	actualDate.setTimeFromExpression(expression)
	console.log("testSetTimeFromExpression(): trying to compare expected date [%s] and actualDate [%s], the latter being set by expression %s", expectedDate, actualDate, expression)
	assert.equal(expectedDate.getHours(), actualDate.getHours(), "hours aren't equal")
	assert.equal(expectedDate.getMinutes(), actualDate.getMinutes(), "minutes aren't equal")
}

function testSimpleSchedule() {
	var aDate = new Date(2015, 2, 20, 13, 30, 0)
	var spec = aDate.getCronspec()
	var sched = DateUtils.simpleSchedule(spec)
	console.log("testSimpleSchedule(): aDate: [%s], spec [%s]SCHEDULE, sched [%s]", aDate, spec, sched.isValid(aDate))
	assert(sched.isValid(aDate))
}

function testSimpleScheduleAndExecute() {
	var aDate = new Date()
	aDate.setSeconds(aDate.getSeconds()+2)
	var spec = aDate.getCronspec()
	var func = function () {
		console.log("<< EXECUTING! Timestamp now is %s <<", new Date())
		assert(true)
	}
	var scheduleObject = DateUtils.simpleScheduleAndExecute(spec, func)
	console.log(">> testSimpleScheduleAndExecute(): aDate: [%s], spec [%s]SCHEDULE, next occurrence: [%s] >>", aDate, spec, scheduleObject.schedule.next(1, new Date()))
}

function testScheduleAndShare() {
	var aDate = new Date()
	aDate.setSeconds(aDate.getSeconds()+2)
	var spec = aDate.getCronspec()
	var scheduleObject = DateUtils.scheduleAndShare(spec, mockBot, "Please remember this is the result of an unit test")
	console.log(">> testScheduleAndShare(): aDate: [%s], spec [%s]SCHEDULE, next occurrence: [%s] >>\n", aDate, spec, scheduleObject.schedule.next(1, new Date()))
}

function testScheduleAndSay() {
	var aDate = new Date()
	aDate.setSeconds(aDate.getSeconds()+2)
	var spec = aDate.getCronspec()
	var scheduleObject = DateUtils.scheduleAndSay(spec, mockBot, "somebody", "Please remember this is the result of an unit test")
	console.log(">> testScheduleAndSay(): aDate: [%s], spec [%s]SCHEDULE, next occurrence: [%s] >>\n", aDate, spec, scheduleObject.schedule.next(1, new Date()))
}

module.exports = {
	testFormat: testFormatYYYYMMDD,
	testSubtractHours: testSubtractHours,
	testGetCronspec: testGetCronspec,
	testSetDateFromExp: testSetDateFromExpression,
	testSetTimeFromExp: testSetTimeFromExpression,
	testDateConst: testDateConstruction,
	testSchedule: testSimpleSchedule,
	testSchedAndExec: testSimpleScheduleAndExecute,
	testSchedAndShare: testScheduleAndShare,
	testSchedAndSay: testScheduleAndSay
}
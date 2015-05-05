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

function testHasPassed() {
	var expectedDate = new Date(2015, 2, 23)
	var actualDate = new Date()
	var passedExpression = '2015/01/21'
	var pendingExpression = '2015/12/24'
	
	// test a date prior to march 23rd
	actualDate.setDateFromExpression(passedExpression)
	console.log("testHasPassed(date): trying to check date %s is before eventDate [%s]", actualDate, expectedDate)
	assert(actualDate.hasPassed(expectedDate), "Date has not yet passed!")
	
	// test a date after march 23rd
	actualDate.setDateFromExpression(pendingExpression)
	console.log("testHasPassed(date): trying to check date %s is after event date [%s]", actualDate, expectedDate)
	assert(!actualDate.hasPassed(expectedDate), "Date has passed already!")
	
	// test a date 24 hours before now: eventDate parameter null
	actualDate = new Date().subtractHours(24)
	console.log("testHasPassed(): trying to check date %s is before now [%s]", actualDate, new Date())
	assert(actualDate.hasPassed(), "Date has not yet passed!")
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



module.exports = {
	testHasPassed: testHasPassed,
	testFormat: testFormatYYYYMMDD,
	testSubtractHours: testSubtractHours,
	testGetCronspec: testGetCronspec,
	testSetDateFromExp: testSetDateFromExpression,
	testSetTimeFromExp: testSetTimeFromExpression,
	testDateConst: testDateConstruction
}
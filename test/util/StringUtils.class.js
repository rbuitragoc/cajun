var assert = require('assert')
var StringUtils = require('../../classes/util/StringUtils.class')

function test_testRegexes() {
	var regexes = [
		/(attendants|people|person|((that|who).+(went|attended))).+(session|class|training)/
	];
	var rudeText = "dishes u recommend";
	assert.throws(StringUtils.isMatch(regexes, rudeText));
	console.log("Testing rude text: \'"+rudeText+"\' and regex threw an error!");
	var niceText = "people who went to some session"
	assert(StringUtils.isMatch(regexes, niceText))
	console.log("Testing nice text: \'"+niceText+"\' and regex test passed!")
}

function testIsNumber_whenNumber() {
	var number = 19;
	assert(StringUtils.isNumber(number))
	console.log("tested "+number+" and is a number!")
}

function testIsNumber_whenNaN() {
	var nana = "nan";
	assert.ok(!StringUtils.isNumber(nana))
	console.log("tested "+nana+" and NaN!")
}

module.exports = {
	testIsNumber100: testIsNumber_whenNumber,
	testIsNumberNaN: testIsNumber_whenNaN,
	testRegexes: test_testRegexes
}
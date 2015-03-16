var assert = require('assert');
var ChatUtils = require('../../classes/util/ChatUtils.class');

function testWasMentioned_plain_mention() {
	var _plain_mention = "dummy, please bring back the fun!";
	console.log("Testing string [%s]", _plain_mention)
	assert(ChatUtils('dummy', _plain_mention));
}

function testWasMentioned_case_insensitive() {
	var _plain_mention = "DuMMy, please bring back the fun!"
	console.log("Testing string [%s]", _plain_mention)
	assert(ChatUtils('dummy', _plain_mention))
}

module.exports = { 
	testMentions: testWasMentioned_plain_mention,
	testMentionCases: testWasMentioned_case_insensitive
}
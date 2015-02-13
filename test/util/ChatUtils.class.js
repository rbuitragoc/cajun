var assert = require('assert');
var ChatUtils = require('../../classes/util/ChatUtils.class');

function testWasMentioned_plain_mention() {
	var _plain_mention = "dummy, please bring back the fun!";
	assert(ChatUtils('dummy', _plain_mention));
}

module.exports = { 
	testMentions: testWasMentioned_plain_mention
}
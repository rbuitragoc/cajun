var util = require('./util')
var managers = require('./managers')
var handlers = require('./conversationHandlers')
console.log("[Starting (old) tests]")
/* DateUtils.class#testFormatYYYYMMDD */
util.dateUtils.testFormat();

/* ChatUtils.class#testWasMentioned_plain_mention */
util.chatUtils.testMentions();

/* StringUtils.isNumber(100) */
util.stringUtils.testIsNumber100();

/* StringUtils.isNumber("nan") */
util.stringUtils.testIsNumberNaN();

/* StringUtils.test_testRegexes()*/
util.stringUtils.testRegexes();

managers.trainingSessionManager.testManagerCanAuthPresenters();
managers.trainingSessionManager.testNonManagerCannotAuthPresenters();
managers.trainingSessionManager.testPreexistingPresenters();
managers.trainingSessionManager.testUnexistingPresenters();
managers.trainingSessionManager.testCreateTrainingSession();

handlers.commandConversationHandler.testAtSignSupportedOnReference();
console.log("[Finished (old) tests!]")
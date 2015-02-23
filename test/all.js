var util = require('./util')
var managers = require('./managers')

/* DateUtils.class#testFormatYYYYMMDD */
util.dateUtils.testFormat();

/* ChatUtils.class#testWasMentioned_plain_mention */
util.chatUtils.testMentions();

managers.trainingSessionManager.testManagerCanAuthPresenters();
managers.trainingSessionManager.testNonManagerCannotAuthPresenters();
managers.trainingSessionManager.testPreexistingPresenters();
managers.trainingSessionManager.testUnexistingPresenters();
managers.trainingSessionManager.testCreateTrainingSession();
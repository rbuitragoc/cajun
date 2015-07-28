var IRCConnector = require("./classes/IRCConnector.class");
var SlackConnector = require("./classes/SlackConnector.class");
var JSONConnector = require("./classes/persistence/JSONConnector.class");
var MongoConnector = require("./classes/persistence/MongoConnector.class");

module.exports = {
	version: "0.2.0",
	environment: process.env.CAJUN_APP_HOST_NAME,
	channel: process.env.CAJUN_SLACK_DEFAULT_CHANNEL,
	botName: process.env.CAJUN_SLACK_BOT_NAME,
	token: process.env.CAJUN_SLACK_BOT_TOKEN, 
	autoReconnect: true,
	autoMark: true,
	connector: SlackConnector,
	persistence: MongoConnector,
	dbURL: process.env.CAJUN_APP_MONGODB_URL,
	appUrls: {
		start: process.env.CAJUN_APP_URL+'start', 
		stop: process.env.CAJUN_APP_URL+'stop'
	},
	maxCollabPoints : 10
};

// Slack API config prod
// module.exports = {
// 	environment: "platanoMachine",
// 	channel: "karma",
// 	botName: "karmabot",
// 	token: 'xoxb-3534020363-hXwUqB5krA8fMZbxR7VmHsxB',
// 	autoReconnect: true,
// 	autoMark: true,
// 	connector: SlackConnector,
// 	persistence: MongoConnector,
//	dbURL: 'mongodb://localhost:27017/slashbot'
// };

// Sample Slack-thru-IRC config
// module.exports = {
// 	environment: "platanoMachine",
// 	channel: "foundrystories",
// 	server: "ffoundry.irc.slack.com",
// 	botName: "obibot",
// 	password: "ffoundry.MUr0IDVbPois5VgPtbYY",
// 	connector: SlackConnector,
// 	token: 'xoxb-3463721915-mXLDStOphmDcva9aBNBuYCcT',
// 	autoReconnect: true,
// 	autoMark: true,
// 	persistence: JSONConnector
// };

// Sample plain IRC config

// module.exports = {
// 	environment: "slashieMachine",
// 	channel: "#slashbot",
// 	server: "verne.freenode.net",
// 	botName: "obibot",
// 	connector: IRCConnector,
// 	persistence: MongoConnector,
// 	dbURL: 'mongodb://localhost:27017/slashbot'
// };
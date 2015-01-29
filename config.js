var IRCConnector = require("./classes/IRCConnector.class");
var SlackConnector = require("./classes/SlackConnector.class");
var JSONConnector = require("./classes/persistence/JSONConnector.class");
var MongoConnector = require("./classes/persistence/MongoConnector.class");

// Sample Slack-thru-IRC config
module.exports = {
	environment: "rick's Lap",
	channel: "karma",
	botName: "karmabot",
	token: 'xoxb-3534020363-hXwUqB5krA8fMZbxR7VmHsxB',
	autoReconnect: true,
	autoMark: true,
	connector: SlackConnector,
	persistence: JSONConnector
};

// Sample plain IRC config

// module.exports = {
// 	environment: "slashieMachine",
// 	channel: "#slashbot",
// 	server: "verne.freenode.net",
// 	password: "ffoundry.MUr0IDVbPois5VgPtbYY",
// 	botName: "obibot",
// 	connector: IRCConnector,
// 	persistence: MongoConnector,
// 	dbURL: 'mongodb://localhost:27017/slashbot'
// };

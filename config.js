var IRCConnector = require("./classes/IRCConnector.class");
var SlackConnector = require("./classes/SlackConnector.class");
var JSONConnector = require("./classes/persistence/JSONConnector.class");
var MongoConnector = require("./classes/persistence/MongoConnector.class");

// Slack API config karmabot for tests
module.exports = {
	version: "1.5",
	environment: "DEVELOPMENT",
	channel: "gambit-test",
	botName: "tal-bot",
	// token: 'xoxb-3558335570-MXw76pJPGbNLLyLi1KYWK8qr',
	token: 'xoxb-3749826050-mKrPHbMYqRDa0mb47lhf3sfr', // Rick's tal-bot 
	autoReconnect: true,
	autoMark: true,
	connector: SlackConnector,
	persistence: MongoConnector,
	dbURL: 'mongodb://localhost:27017/collabot',
	//dbURL: 'mongodb://'+process.env.MDBUSERNAME+':'+process.env.MDBPWD+'@'+process.env.MDBHOST+':'+process.env.MDBPORT+'/collabot',
	appUrls: {
		start: process.env.APPSTART, 
			//url: 'http://salty-inlet-8617.herokuapp.com/start',
			//url: 'http://localhost:3000/start',
		stop: process.env.APPSTOP
			//url: 'http://salty-inlet-8617.herokuapp.com/stop',
			//url: 'http://localhost:3000/stop',
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
var IRCConnector = require("./classes/IRCConnector.class");
var SlackConnector = require("./classes/SlackConnector.class");
var JSONConnector = require("./classes/persistence/JSONConnector.class");
var MongoConnector = require("./classes/persistence/MongoConnector.class");


// Slack API config karmabot for tests
module.exports = {
	version: "0.5.0",
	environment: process.env.ENVIRONMENT,
	// environment: "rick's lap",
	channel: process.env.CHANNEL,
	botName: process.env.BOTNAME,
	// token: 'xoxb-3558335570-MXw76pJPGbNLLyLi1KYWK8qr', // Good ol' Collabot
	token: process.env.BOT_TOKEN, //'xoxb-3749826050-mKrPHbMYqRDa0mb47lhf3sfr', // Rick's tal-bot 
	autoReconnect: true,
	autoMark: true,
	connector: SlackConnector,
	persistence: MongoConnector,
	// dbURL: 'mongodb://'+process.env.MDBUSERNAME+':'+process.env.MDBPWD+'@'+process.env.MDBHOST+':'+process.env.MDBPORT+'/'+process.env.MDBDB,
	dbURL: process.env.MDBURL,// 'mongodb://localhost:27017/collabot',
	appUrls: {
		start: process.env.APPURL+'start', 
			// 'http://salty-inlet-8617.herokuapp.com/start',
			// 'http://localhost:3000/start',
		stop: process.env.APPURL+'stop'
			// 'http://salty-inlet-8617.herokuapp.com/stop'
			// 'http://localhost:3000/stop'
	},
	maxCollabPoints : 10,
	trainingSessionManager: 'slizarazo',
	enrollmentDaysThreshold : 1
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
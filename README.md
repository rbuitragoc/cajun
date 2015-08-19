
Cajunbot v. 0.2.0
=================
A simple slack bot that goes beyond slackbot (Inspired by https://github.com/slashman/slashbot) 

What it can do
==============
```
[testbot give] Gives a player X points. Example: 'testbot give 5 points to slash [because he is a cool dude]' (Yeah, you can add a reason for that, no need to use square brackets).

[testbot about] Gets some information about the 'testbot'

[testbot how am i] Tells you your overall, daily, weekly and last week scores.

[testbot top [day|week|month|year] [channel_name]] Tells you the top ten collaborators by period and channel name. Period and Channel are optional.
```

Requirements
============
- Node.js v 0.10+
- MongoDB v3.0.0+ 
- npm v2.5.0+

Running it
==========

- Set the mongoDB variables located at config.js in your ~/.bashrc file (Make sure you specify appropriate values to environment variables required. The mechanism to specify environment variables depends on the OS or shell you're using, so please read the related documentation if you're not sure about how to do it. See below a sample set of variables for reference)
- Type `npm install` and then `npm test` to finally issue `npm start`. 

Debug Mode
==========
If the `config.debug` param exists and it is set to true, you'll see the bot is logged in to slack automatically. Otherwise, you'll have to do the following to bring it up:

- Open your browser at the URL specified in the CAJUN_APP_URL environment variable 
- Flip the switch on! - that will log the bot into Slack. 


Sample Environment Variables (*nix shell example)
=================================================
``` bash
# Cajun!
export CAJUN_APP_HOST_NAME="Hi-Octane Gasoline"
export CAJUN_APP_URL="http://localhost:3000/"
export CAJUN_APP_MONGODB_URL="mongodb://localhost:27017/cajundb"
export CAJUN_SLACK_DEFAULT_CHANNEL="channelname"
export CAJUN_SLACK_BOT_NAME="botname"
export CAJUN_SLACK_BOT_TOKEN="YOURTOKENVALUEHERE"
```
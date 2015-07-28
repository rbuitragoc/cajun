
Cajunbot v. 0.2.0
=================
A simple slack bot that goes beyond slackbot.

What it can do
==============
```
[testbot give] Gives a player X points. Example: 'testbot give 5 points to slash [because he is a cool dude]' (Yeah, you can add a reason for that, no need to use square brackets).

[testbot about] Gets some information about the 'testbot'

[testbot how am i] Tells you your overall, daily, weekly and last week scores.

[testbot top [day|week|month|year] [channel_name]] Tells you the top ten collaborators by period and channel name. Period and Channel are optional.
```

Running it
==========

- Set the mongoDB variables located at config.js in your ~/.bashrc file (Make sure you specify appropriate values to environment variables required. The mechanism to specify environment variables depends on the OS or shell you're using, so please read the related documentation if you're not sure about how to do it. See below a sample set of variables for reference)
- Type `npm install` and then `npm test` to finally issue `npm start`. 
- Then open your browser at the URL specified in the CAJUN_APP_URL environment variable - that will log the bot into Slack. 

Sample Environment Variables (*nix shell example)
=================================================
``` bash
# Cajun!
export CAJUN_APP_HOST_NAME="Scarr"
export CAJUN_APP_URL="http://localhost:3000/"
export CAJUN_APP_MONGODB_URL="mongodb://localhost:27017/cajundb"
export CAJUN_SLACK_DEFAULT_CHANNEL="bots-test"
export CAJUN_SLACK_BOT_NAME="testbot"
export CAJUN_SLACK_BOT_TOKEN="xoxb-3462251399-cQMjLNLJ7W6pa6dChsgEg1Y0"
```
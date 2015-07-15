![Codeship Status for vpgambit/collabot](https://codeship.com/projects/87838d20-936b-0132-849a-5668b62cd35b/status?branch=dev)

Collabot v. 0.9.5
=================
A fun slack bot to incentive collaboration between developers.


Running it
==========

- Set the mongoDB variables located at config.js in your ~/.bashrc file.
- Make sure you specify appropriate values to environment variables required. The mechanism to specify environment variables depends on the OS or shell you're using, so please read the related documentation if you're not sure about how to do it. See below a sample set of variables for reference.
- Type `npm install` and then `npm test` to finally issue `npm start`. 
- Then do a GET to the URL specified in the APPSTART environment variable - that will log the bot into Slack. 


Other tasks
===========

Collabot works over Slack API integration. It's configured by default on one channel, but it can be set to join multiple channels:

* Any user can add the bot to any channel 
* The admins can set the channels the bot is in via the bot integration panel

Sample Environment Variables (*nix shell example)
=================================================
```shell
# Gambit!
export ENVIRONMENT="Gambit dev's Lap"
export APPURL="http://localhost:3000/"
export MDBURL="mongodb://localhost:27017/collabot"
export CHANNEL="gambit-test"
export BOTNAME="alpha-bot"
export BOT_TOKEN="xoxb-4181420889-GK8qfKC5tnr2RerqcGfsg55P"
export BOT_REGIONAL='{"medellin": {"groups": ["gambit-disposable-01"], "manager": "slizarazo", "channels" : {"training" : "gambit-disposable-02"}}}'
```
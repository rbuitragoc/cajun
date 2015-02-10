[ ![Codeship Status for vpgambit/collabot](https://codeship.com/projects/88c1e940-92aa-0132-f0ed-6a8221c3ead3/status?branch=dev)](https://codeship.com/projects/61945)

collabot 
========
A fun slack bot to incentive collaboration between developers

Running it
==========
Set the mongoDB variables located at config.js in your ~/.bashrc file.

Type `npm install` and then `npm test` to finally issue `npm start`

If you are going to use the MongoConnector, make sure you have a mongod instance 
responding to the url on config.js.

Other tasks
===========

Collabot works over Slack API integration. It's configured by default on one channel, but it can be set to join multiple channels:

* Any user can add the bot to any channel 
* The admins can set the channels the bot is in via the bot integration panel